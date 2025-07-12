import { Module } from '@nestjs/common';
import { ImageProcessorService } from './image-processor.service';
import { ImageProcessorController } from './image-processor.controller';
import { MulterModule } from '@nestjs/platform-express';
import * as multer from 'multer';
import { FileCompressService } from 'src/shared/services';
import * as path from 'node:path';
import * as fs from 'node:fs';
import { ThumbnailService } from 'src/shared/services/thumbnail';

@Module({
  imports: [
    MulterModule.registerAsync({
      useFactory: () => {
        const uploadDir = path.resolve(__dirname, './temp');

        if (!fs.existsSync(uploadDir)) {
          fs.mkdirSync(uploadDir, { recursive: true });
        }

        return {
          storage: multer.diskStorage({
            destination: (_, __, cb) => {
              const uploadDir = path.resolve(__dirname, './temp');
              if (!fs.existsSync(uploadDir)) {
                fs.mkdirSync(uploadDir, { recursive: true });
              }
              cb(null, uploadDir);
            },
            filename: (_, file, cb) => {
              cb(null, file.originalname);
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
