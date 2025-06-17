import path from 'node:path';
import url from 'node:url';

export const __filename = url.fileURLToPath(import.meta.url);
export const __dirname = path.dirname(__filename);
