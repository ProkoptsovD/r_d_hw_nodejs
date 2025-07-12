import * as fsp from 'node:fs/promises';
import * as path from 'node:path';

export const isDirOrFileExist = async (path: string) => {
  return await fsp
    .stat(path)
    .then(() => true)
    .catch(() => false);
};

export const saveBufferToFile = async (
  buffer: Buffer,
  outputDir: string,
  filename: string,
) => {
  const targetPath = path.resolve(outputDir, filename);

  const dir = path.dirname(targetPath);
  await fsp.mkdir(dir, { recursive: true });
  await fsp.writeFile(targetPath, buffer);
};
