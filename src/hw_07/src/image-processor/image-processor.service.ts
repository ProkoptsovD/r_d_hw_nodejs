import * as path from 'node:path';
import * as fsp from 'node:fs/promises';
import * as os from 'node:os';
import { Mutex, Semaphore } from 'async-mutex';

import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  ThumbnailResult,
  ThumbnailResultError,
  ThumbnailResultSuccess,
} from 'src/shared/services/thumbnail';
import { saveBufferToFile } from 'src/shared/helpers';

interface CompressService {
  unzip(path: string | Buffer, output: string): Promise<void>;
}
interface PreviewService {
  createImagePreview(
    path: string,
    options?: Record<string, unknown>,
  ): Promise<ThumbnailResult>;
  isSuccess(result: ThumbnailResult): ThumbnailResultSuccess;
  isError(result: ThumbnailResult): ThumbnailResultError;
}

export interface ProcessingStats {
  processed: number;
  skipped: number;
  durationMs: number;
  errors: NullOr<Record<string, string>>;
}

@Injectable()
export class ImageProcessorService {
  private readonly mutex = new Mutex();
  private readonly defaultThreads = 4;
  private readonly logger = new Logger(ImageProcessorService.name);

  constructor(
    @Inject('CompressService')
    private readonly compressService: CompressService,
    @Inject('PreviewService') private readonly previewService: PreviewService,
  ) {}

  async upload(file: Express.Multer.File): Promise<ProcessingStats> {
    const baseDir = path.dirname(file.path);
    const requestId = path.basename(baseDir);
    const resultDir = path.resolve(__dirname, `./thumbnails/${requestId}`);
    const unpackedDir = path.join(baseDir, 'unpacked');

    this.logger.verbose(`Handling request with ID ${requestId}`);

    const threads = os.availableParallelism() || this.defaultThreads;
    const semaphore = new Semaphore(threads);

    const stats: ProcessingStats = {
      processed: 0,
      skipped: 0,
      errors: null,
      durationMs: 0,
    };

    await fsp.mkdir(unpackedDir, { recursive: true });
    await this.compressService.unzip(file.path, unpackedDir);

    const files = await fsp.readdir(unpackedDir);

    const start = performance.now();

    await Promise.allSettled(
      files.map((filename) => {
        return semaphore.runExclusive(async () => {
          const filepath = path.resolve(unpackedDir, filename);
          const result = await this.previewService.createImagePreview(filepath);
          const isSuccess = this.previewService.isSuccess(result);
          const isError = this.previewService.isError(result);

          const release = await this.mutex.acquire();
          try {
            if (isError) {
              stats.skipped += 1;
              stats.errors ??= {};
              stats.errors[filename] = (result as ThumbnailResultError).reason;
              return null;
            } else if (isSuccess) {
              stats.processed += 1;
            }
          } finally {
            release();
          }

          if (isSuccess) {
            await saveBufferToFile(result.buffer, resultDir, filename);
          }
        });
      }),
    );

    const end = performance.now() - start;
    stats.durationMs = end;

    // Clean up temp folder after processing
    await fsp.rm(baseDir, { recursive: true, force: true });

    return stats;
  }
}
