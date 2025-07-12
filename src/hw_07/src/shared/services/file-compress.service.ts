import * as path from 'node:path';

import { Injectable } from '@nestjs/common';
import { CompressService } from '../interfaces';
import { ZipService } from './zip.service';
import { isString } from '../helpers';

export type CompressionAlgo = 'zip';
export type DecompressFileOptions = {
  algo: CompressionAlgo;
  outputDir: string;
};

@Injectable()
export class FileCompressService {
  private decoder: CompressService;

  private async decompress(
    source: string | Buffer,
    options: DecompressFileOptions,
  ) {
    if (options.algo === 'zip') {
      if (!this.decoder) {
        this.decoder = new ZipService();
      }

      await this.decoder.decompress(source, options.outputDir);
    }
  }

  async unzip(dir: string | Buffer, outputDir: string) {
    const source = isString(dir) ? path.resolve(dir) : dir;
    await this.decompress(source, { algo: 'zip', outputDir });
  }
}
