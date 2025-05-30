import { Module } from '@nestjs/common';
import { CloudinaryService } from './cloudinary.service';
import { UploadController } from './cloudinary.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  controllers: [UploadController],
  providers: [CloudinaryService],
  exports: [CloudinaryService],
})
export class CloudinaryModule {}
