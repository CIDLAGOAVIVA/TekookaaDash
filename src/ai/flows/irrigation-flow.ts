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
      Your task is to provide a clear and concise irrigation recommendation for a {{cropType}} crop.

      First, estimate the evapotranspiration (ETc) rate based on the following data:
      - Air Temperature: {{airTemperature}}°C
      - Air Humidity: {{airHumidity}}%
      - Wind Speed: {{windSpeed}} km/h
      - Luminosity (Solar Radiation): {{luminosity}} Lux

      A higher temperature, higher wind speed, higher luminosity, and lower humidity will result in a higher ETc. A typical ETc for crops can range from 2 mm/day in cool, humid conditions to 10 mm/day in hot, dry, windy conditions.

      After estimating the ETc, analyze it in conjunction with the soil moisture to provide a recommendation.
      - Current Soil Moisture: {{soilMoisture}}%
      
      Your analysis should follow these rules:
      - If soil moisture is critically low (e.g., < 25%), recommend immediate irrigation regardless of the estimated ETc.
      - If soil moisture is adequate (e.g., > 40-50%) and the estimated ETc is low, recommend holding off on irrigation.
      - If soil moisture is borderline and the estimated ETc is high, recommend a light irrigation to compensate for the expected water loss.
      
      Your final recommendation should be practical and easy to understand for a farm manager. Be direct and do not explain your ETc calculation, just provide the final action.
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
