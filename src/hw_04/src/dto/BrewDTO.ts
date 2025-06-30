import { z } from 'zod';

export const BrewDTO = z
	.object({
		beans: z.string().min(3).max(40).describe('Назва/суміш зерен'),
		method: z.enum(['v60', 'aeropress', 'chemex', 'espresso']).describe('Спосіб заварювання'),
		rating: z.number().min(1).max(5).nullable().default(null).describe('Наскільки смак сподобався'),
		notes: z.string().max(200).nullable().default(null).describe('Вільні нотатки'),
		brewedAt: z
			.string()
			.refine((val) => !isNaN(Date.parse(val)), {
				message: 'Must be a valid ISO 8601 date string',
			})
			.default(new Date().toISOString())
			.describe('Дата / час, якщо не заповнено, то new Date().toISOString()'),
	})
	.required()
	.describe('Одна чашка - один рецепт');

export type Brew = z.infer<typeof BrewDTO> & { id: string };
