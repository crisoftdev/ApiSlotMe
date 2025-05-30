import { Controller, Get, Query, Res, Post, Body } from '@nestjs/common';
import { Response } from 'express';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { MercadoPagoService } from './mercadopago.service';

@Controller('mercadopago')
export class MercadoPagoController {
  constructor(
    private readonly httpService: HttpService,
    private readonly mpService: MercadoPagoService,
  ) {}

  @Get('conectar')
  async conectarCuenta(@Res() res: Response) {
    const clientId = '6815443244246940';
    const redirectUri = 'http://localhost:3000/mercadopago/callback'; // Cambia esto a tu URL

    const authUrl = `https://auth.mercadopago.com.ar/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}`;
    res.redirect(authUrl);
  }

  @Get('callback')
  async callback(@Query('code') code: string, @Res() res: Response) {
    const clientId = '6815443244246940';
    const clientSecret = 'nNJPGFzYtTVaZMDtvQbXkMc9ZvfIrGrJ';
    const redirectUri = 'http://localhost:3000/mercadopago/callback';

    const tokenData = {
      grant_type: 'authorization_code',
      client_id: clientId,
      client_secret: clientSecret,
      code: code,
      redirect_uri: redirectUri,
    };

    try {
      const response = await lastValueFrom(
        this.httpService.post('https://api.mercadopago.com/oauth/token', tokenData)
      );

      const { access_token, refresh_token, user_id } = response.data;

      // 🔥 Guardá en tu base de datos: access_token, refresh_token, user_id
      console.log('✅ Vendedor conectado:', { access_token, refresh_token, user_id });

      res.send('Cuenta MercadoPago conectada correctamente 🎉');
    } catch (error) {
      console.error('Error al conectar MercadoPago:', error.response?.data || error);
      res.send('❌ Error al conectar MercadoPago');
    }
  }

  @Post('crear-preferencia')
  async crearPreferencia(@Body() body: any) {
    // 🔥 Buscá el access_token del vendedor en tu base de datos
    const vendedorId = body.vendedorId; // Ejemplo: "paddle-principado"
    const accessToken = 'ACCESS_TOKEN_DEL_VENDEDOR'; // 🔴 A reemplazar con tu lógica real

    return await this.mpService.crearPreferenciaDelVendedor(accessToken, body);
  }
}
