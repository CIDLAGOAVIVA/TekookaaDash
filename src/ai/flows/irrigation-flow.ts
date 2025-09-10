'use server';
/**
 * @fileOverview An AI agent for providing irrigation recommendations.
 * 
 * - getIrrigationRecommendation - A function that returns an irrigation recommendation.
 * - IrrigationInput - The input type for the getIrrigationRecommendation function.
 * - IrrigationOutput - The return type for the getIrrigationRecommendation function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import { calculateEvapotranspiration, getCurrentDayOfYear, luxToSolarRadiation } from '@/lib/evapotranspiration';

const IrrigationInputSchema = z.object({
  soilMoisture: z.number().describe('The current soil moisture percentage.'),
  airTemperature: z.number().describe('The current air temperature in Celsius.'),
  airHumidity: z.number().describe('The current air humidity percentage.'),
  windSpeed: z.number().describe('The current wind speed in km/h.'),
  luminosity: z.number().describe('The current solar radiation in Lux.'),
  cropType: z.string().describe('The type of crop being cultivated.'),
  evapotranspiration: z.number().optional().describe('The current evapotranspiration rate in mm/day.'),
  // Optional fields for more precise ET calculation
  tempMin: z.number().optional().describe('Minimum temperature in Celsius'),
  tempMax: z.number().optional().describe('Maximum temperature in Celsius'),
  latitude: z.number().optional().describe('Farm latitude in degrees'),
});

export type IrrigationInput = z.infer<typeof IrrigationInputSchema>;

export type IrrigationOutput = z.infer<typeof IrrigationOutputSchema>;

const IrrigationOutputSchema = z.object({
  recommendation: z.string().describe('A concise recommendation on whether to irrigate or not, and how much. The response should be in Brazilian Portuguese.'),
  calculatedET: z.number().describe('The calculated evapotranspiration rate in mm/day'),
});

const irrigationPrompt = ai.definePrompt({
  name: 'irrigationPrompt',
  input: { schema: IrrigationInputSchema },
  output: { schema: IrrigationOutputSchema },
  prompt: `
      You are an expert agronomist specializing in irrigation management.
      Your task is to provide a clear and concise irrigation recommendation for a {{cropType}} crop based on the following real-time data:

      - Soil Moisture: {{soilMoisture}}%
      - Air Temperature: {{airTemperature}}°C
      - Air Humidity: {{airHumidity}}%
      - Wind Speed: {{windSpeed}} km/h
      - Luminosity (Solar Radiation): {{luminosity}} Lux
      - Evapotranspiration: {{evapotranspiration}} mm/dia

      Analyze the data and provide a direct recommendation. Your analysis should follow these rules:
      - If soil moisture is critically low (e.g., < 25%), recommend immediate irrigation.
      - If soil moisture is adequate (e.g., > 40-50%) and weather conditions (low temperature, high humidity, low wind/luminosity) don't favor water loss, recommend holding off on irrigation.
      - If soil moisture is borderline and weather conditions favor water loss (high temperature, low humidity, high wind/luminosity), recommend irrigation to compensate.
      - Consider the evapotranspiration rate as a key indicator of water loss. Higher rates indicate greater need for irrigation.
      
      Your final recommendation should be practical and easy to understand for a farm manager. Be direct.
      Start with "Recomendação:"
      
      Example: "Recomendação: A umidade do solo está adequada. Nenhuma irrigação é necessária no momento. Monitore novamente em 24 horas."
      Example: "Recomendação: Risco de estresse hídrico. Inicie a irrigação com uma lâmina de 5mm para repor a umidade perdida."
    `,
});

const irrigationFlow = ai.defineFlow(
  {
    name: 'irrigationFlow',
    inputSchema: IrrigationInputSchema,
    outputSchema: IrrigationOutputSchema,
  },
  async (input) => {
    // Calculate evapotranspiration if not provided
    let evapotranspiration = input.evapotranspiration;

    if (evapotranspiration === undefined) {
      // Use latitude or default to central Brazil if not provided
      const latitude = input.latitude ?? -15.78; // Default latitude for Brasília

      // Calculate mean temp if min/max are provided, or use airTemperature as mean
      const tempMean = input.airTemperature;

      // Use provided min/max or estimate based on mean temperature +/- 5°C
      const tempMin = input.tempMin ?? (tempMean - 5);
      const tempMax = input.tempMax ?? (tempMean + 5);

      // Get current day of year
      const dayOfYear = getCurrentDayOfYear();

      // Convert luminosity to solar radiation for calculation
      const solarRadiation = luxToSolarRadiation(input.luminosity);

      // Calculate evapotranspiration
      evapotranspiration = calculateEvapotranspiration(
        tempMean,
        tempMax,
        tempMin,
        latitude,
        dayOfYear,
        solarRadiation
      );
    }

    // Add the calculated evapotranspiration to the input
    const enrichedInput = {
      ...input,
      evapotranspiration
    };

    const { output } = await irrigationPrompt(enrichedInput);

    // Return both the recommendation and the calculated ET value
    return {
      recommendation: output!.recommendation,
      calculatedET: evapotranspiration
    };
  }
);

export async function getIrrigationRecommendation(input: IrrigationInput): Promise<IrrigationOutput> {
  return irrigationFlow(input);
}
