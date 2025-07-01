import { Logger, Module, OnApplicationShutdown } from '@nestjs/common';
import { TeaController } from './tea.controller';
import { TeaService } from './tea.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [TeaController],
  providers: [TeaService],
})
export class TeaModule implements OnApplicationShutdown {
  private readonly logger = new Logger();

  onApplicationShutdown(signal?: string) {
    if (signal === 'SIGINT') {
      this.logger.log('Bye tea‑lovers 👋');
    }
  }
}
