import { Module } from '@nestjs/common';
import { MinegocioController } from './minegocio.controller';
import { MinegocioService } from './minegocio.service';

@Module({
  controllers: [MinegocioController],
  providers: [MinegocioService]
})
export class MinegocioModule {}
