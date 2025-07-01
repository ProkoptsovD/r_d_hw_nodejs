import { z } from 'zod';

export const TeaSchema = z.object({
  id: z.string(),
  name: z.string().min(3).max(40).describe('Name of tea'),
  origin: z.string().min(2).max(30).describe('Origin of tea leaves'),
  rating: z.number().min(1).max(10).nullish().describe('Tea rating'),
  brewTemp: z
    .number()
    .min(60, "You cannot brew tea if water's temperature is below °C60")
    .max(100, "If water's temperature is above °C100, the tea won't taste good")
    .nullish()
    .describe('Tea brewing temperature'),
  notes: z.string().max(151).nullish().describe('Any sutable notes'),
});

export type TeaEntity = z.infer<typeof TeaSchema>;
