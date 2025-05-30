import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
export class UserController {
    @UseGuards(AuthGuard('jwt'))
    @Get('me')
    getMe(@Request() req) {
        return req.user;
    }
}
