import { Module } from '@nestjs/common';
import { ImageProcessorService } from './image-processor.service';
import { ImageProcessorController } from './image-processor.controller';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';
import { FileCompressService } from 'src/shared/services';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { ThumbnailService } from 'src/shared/services/thumbnail';
import { randomUUID } from 'node:crypto';

@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory: () => {
        const baseDir = path.resolve(__dirname, './temp');

        return {
          storage: multer.diskStorage({
            destination: (_, __, cb) => {
              const uniqueDir = path.join(
                baseDir,
                `${Date.now()}-${randomUUID()}`,
              );
              fs.mkdirSync(uniqueDir, { recursive: true });
              cb(null, uniqueDir);
            },
            filename: (_, file, cb) => {
              const uniqueName = `${Date.now()}-${randomUUID()}${path.extname(file.originalname)}`;
              cb(null, uniqueName);
            },
          }),
        };
      },
    }),
  ],
  providers: [
    ImageProcessorService,
    {
      provide: 'CompressService',
      useClass: FileCompressService,
    },
    {
      provide: 'PreviewService',
      useClass: ThumbnailService,
    },
  ],
  controllers: [ImageProcessorController],
})
export class ImageProcessorModule {}
