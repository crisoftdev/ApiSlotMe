import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';

import { HomeController } from './home/home.controller';
import { HomeModule } from './home/home.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { LocalesModule } from './locales/locales.module';
import { HorariosNegocioModule } from './horariosnegocio/horariosnegocio.module';
import { MercadoPagoModule } from './mercadopago/mercadopago.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT as string),
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      autoLoadEntities: true,
      synchronize: false, // cambia a false en producción
    }),
    UserModule,
    AuthModule,
    HomeModule,
    CloudinaryModule,
    LocalesModule,
    HorariosNegocioModule,
    MercadoPagoModule,
  ],
  controllers: [HomeController],
})
export class AppModule {}
