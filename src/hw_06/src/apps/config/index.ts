import z from 'zod';

const ConfigSchema = z.object({
	PORT: z.number().default(3000),
	HOST: z.string().min(1).default('localhost'),
	NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
});

export const config = ConfigSchema.parse(process.env);
export type Config = z.infer<typeof ConfigSchema>;
