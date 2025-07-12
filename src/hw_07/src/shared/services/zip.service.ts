import { CompressService } from '../interfaces';
import * as AdmZip from 'adm-zip';

export class ZipService implements CompressService {
  async decompress(dir: string, output: string): Promise<unknown> {
    const zip = new AdmZip(dir);

    return new Promise((resolve, reject) => {
      zip.extractAllToAsync(output, false, false, (error: unknown) => {
        if (error) {
          console.log(error);
          reject(error as Error);
        } else {
          console.log(`Extracted to "${output}" successfully`);
          resolve(true);
        }
      });
    });
  }
}
