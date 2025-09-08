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
  evapotranspiration: z.number().describe('The current evapotranspiration rate in mm/day.'),
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
      Your task is to provide a clear and concise irrigation recommendation based on the following data for a {{cropType}} crop.
      
      - Current Soil Moisture: {{soilMoisture}}%
      - Evapotranspiration (ETc): {{evapotranspiration}} mm/day

      Analyze the data and provide a recommendation.
      - If soil moisture is critically low (e.g., < 25%), recommend immediate irrigation.
      - If soil moisture is adequate (e.g., > 40-50%) and evapotranspiration is low, recommend holding off on irrigation.
      - If soil moisture is borderline and evapotranspiration is high, recommend a light irrigation.
      
      Your recommendation should be practical and easy to understand for a farm manager. Be direct.
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
