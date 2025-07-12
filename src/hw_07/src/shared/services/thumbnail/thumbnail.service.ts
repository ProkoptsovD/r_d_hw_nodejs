import * as path from 'node:path';

import { Injectable } from '@nestjs/common';
import { WorkerService } from '../worker.service';

export type ThumbnailResultSuccess = {
  buffer: Buffer;
  workerId: string;
  success: true;
  __type: 'success';
};

export type ThumbnailResultError = {
  buffer: Buffer;
  workerId: string;
  success: false;
  reason: string;
  __type: 'error';
};

export type ThumbnailResult = ThumbnailResultSuccess | ThumbnailResultError;

@Injectable()
export class ThumbnailService {
  private readonly workerService: WorkerService;
  private workerPath = path.resolve(__dirname, 'thumbnail.worker.js');

  constructor() {
    this.workerService = new WorkerService(this.workerPath);
  }

  async createImagePreview(sourcePath: string): Promise<ThumbnailResult> {
    const result = await this.workerService.runWorkerTask<
      Anything,
      ThumbnailResult
    >({ url: sourcePath });

    if (!result.success) {
      return {
        ...result,
        __type: 'error',
      };
    } else {
      return {
        ...result,
        __type: 'success',
      };
    }
  }

  isError(result: ThumbnailResult): result is ThumbnailResultError {
    return result.__type === 'error';
  }
  isSuccess(result: ThumbnailResult): result is ThumbnailResultSuccess {
    return result.__type === 'success';
  }
}
