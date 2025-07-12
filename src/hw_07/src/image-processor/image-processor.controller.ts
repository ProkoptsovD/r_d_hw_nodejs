import {
  Controller,
  HttpCode,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { FileTypeValidationPipe } from 'src/shared/pipes';
import { ImageProcessorService } from './image-processor.service';

@Controller('zip')
export class ImageProcessorController {
  constructor(private readonly imageProcessor: ImageProcessorService) {}

  @Post('/')
  @HttpCode(201)
  @UseInterceptors(FileInterceptor('zip'))
  async upload(
    @UploadedFile(new FileTypeValidationPipe(['application/zip']))
    file: Express.Multer.File,
  ) {
    const stats = await this.imageProcessor.upload(file);

    return stats;
  }
}
