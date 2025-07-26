import { Prettify } from '../../../global';
import { Product } from './entity';

export type CreateProductDto = Prettify<Omit<Product, 'id'>>;
export type UpdateProductDto = Prettify<Partial<Product>>;
