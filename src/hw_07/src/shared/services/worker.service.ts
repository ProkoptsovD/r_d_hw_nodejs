import { Injectable, Logger } from '@nestjs/common';
import { Worker } from 'node:worker_threads';
import { faker } from '@faker-js/faker'; // Kyrylo, don't blame me for this ;) this is for fan. In real world I would never do such a thing
import { isString } from '../helpers';

@Injectable()
export class WorkerService {
  private readonly logger = new Logger(WorkerService.name);

  constructor(private readonly workerPath: string) {}

  async runWorkerTask<T = Anything, R = unknown>(data: T): Promise<R> {
    return new Promise((resolve, reject) => {
      const worker = new Worker(this.workerPath, {
        workerData: { data, id: faker.person.firstName() },
        execArgv: ['--no-warnings'],
      });

      worker.on('message', (message: R) => {
        if (isString(message)) {
          this.logger.log(message);
          return;
        }

        resolve(message);
        void worker.terminate();
      });

      worker.on('error', (error) => {
        reject(error);
      });

      worker.on('exit', (code) => {
        if (code !== 0) {
          reject(new Error(`Worker stopped with exit code ${code}`));
        }
      });
    });
  }
}
