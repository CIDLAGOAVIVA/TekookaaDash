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

const IrrigationInputSchema = z.object({
  soilMoisture: z.number().describe('The current soil moisture percentage.'),
  airTemperature: z.number().describe('The current air temperature in Celsius.'),
  airHumidity: z.number().describe('The current air humidity percentage.'),
  windSpeed: z.number().describe('The current wind speed in km/h.'),
  luminosity: z.number().describe('The current solar radiation in Lux.'),
  cropType: z.string().describe('The type of crop being cultivated.'),
});

export type IrrigationInput = z.infer<typeof IrrigationInputSchema>;

export type IrrigationOutput = z.infer<typeof IrrigationOutputSchema>;

const IrrigationOutputSchema = z.object({
    recommendation: z.string().describe('A concise recommendation on whether to irrigate or not, and how much. The response should be in Brazilian Portuguese.'),
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

      Analyze the data and provide a direct recommendation. Your analysis should follow these rules:
      - If soil moisture is critically low (e.g., < 25%), recommend immediate irrigation.
      - If soil moisture is adequate (e.g., > 40-50%) and weather conditions (low temperature, high humidity, low wind/luminosity) don't favor water loss, recommend holding off on irrigation.
      - If soil moisture is borderline and weather conditions favor water loss (high temperature, low humidity, high wind/luminosity), recommend irrigation to compensate.
      
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
      const { output } = await irrigationPrompt(input);
      return output!;
    }
);

export async function getIrrigationRecommendation(input: IrrigationInput): Promise<IrrigationOutput> {
    return irrigationFlow(input);
}
