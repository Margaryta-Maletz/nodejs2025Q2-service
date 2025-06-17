import {
  Controller,
  Post,
  Body,
  HttpStatus,
  UnauthorizedException,
  HttpCode,
} from '@nestjs/common';
import { CreateUserDto } from '../user/create-user.dto';
import { AuthService } from './auth.service';
import { Public } from './auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @Public()
  async signup(@Body() signupDto: CreateUserDto) {
    return await this.authService.signup(signupDto);
  }

  @Post('login')
  @Public()
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: CreateUserDto) {
    return await this.authService.login(loginDto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() refreshTokenDto: string) {
    if (!refreshTokenDto) {
      throw new UnauthorizedException('Refresh token is not valid');
    }

    return await this.authService.refresh(refreshTokenDto);
  }
}
