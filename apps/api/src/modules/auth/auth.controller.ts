import { Controller, Post, Get, Body, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly service: AuthService) {}

  @Post('register')
  register(@Body('email') email: string, @Body('password') password: string, @Body('name') name: string) {
    return this.service.register(email, password, name);
  }

  @Post('login')
  login(@Body('email') email: string, @Body('password') password: string) {
    return this.service.login(email, password);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  getProfile(@Req() req: Request) {
    const user = (req as any).user as { sub: string };
    return this.service.getProfile(user.sub);
  }
}
