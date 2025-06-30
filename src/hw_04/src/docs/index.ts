import { mergeSpecs } from './mergeSpecs.ts';
import { createZodSpec } from '../lib/openapi/spec.ts';
import { jsdocSpec } from '../lib/swagger/swagger.ts';

export const generateSpecs = () => {
	return mergeSpecs(jsdocSpec, createZodSpec());
};
