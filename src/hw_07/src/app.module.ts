import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ImageProcessorModule } from './image-processor/image-processor.module';

@Module({
  imports: [ImageProcessorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
