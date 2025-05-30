import { Controller, Post, Body, UnauthorizedException, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response, Request } from 'express';
import { UserService } from '../user/user.service'; // 👈 asegurate de importar


@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private userService: UserService // ✅ Agregado aquí
  ) { }

  @Post('login')
  async login(@Body() body: { usuario: string; clave: string }, @Res() res: Response) {
    const user = await this.authService.validateUser(body.usuario, body.clave);
    if (!user) throw new UnauthorizedException();

    const tokens = await this.authService.generateTokens(user);

    // ✅ OPCIONAL: para web
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 48 * 60 * 60 * 1000,
    });

    // ✅ NECESARIO para apps móviles
    return res.json({
      access_token: tokens.accessToken,
      refresh_token: tokens.refreshToken, // 👈 agregalo acá
      user
    });
  }


  @Post('register')
  async register(@Body() body: { usuario: string; clave: string }) {
    return this.authService.register(body.usuario, body.clave);
  }

  @Post('refresh')
  async refresh(@Body() body: { refreshToken: string }, @Res() res: Response) {
    const token = body.refreshToken;
    if (!token) throw new UnauthorizedException('No hay token');

    try {
      const payload = this.authService.verifyRefreshToken(token);
      const user = await this.userService.findById(payload.sub);
      if (!user) throw new UnauthorizedException('Usuario no encontrado');

      const tokens = await this.authService.generateTokens(user);

      // Podés mantener esto para web si querés:
      res.cookie('refreshToken', tokens.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.json({
        access_token: tokens.accessToken,
        refresh_token: tokens.refreshToken, // 👈 necesario
        user
      });
    } catch (e) {
      throw new UnauthorizedException('Refresh token inválido');
    }
  }




}
