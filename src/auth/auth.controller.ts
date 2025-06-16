import {
  Controller,
  Post,
  Body,
  HttpStatus,
  UnauthorizedException,
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
    const user = await this.authService.signup(signupDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'User created successfully',
      user,
    };
  }

  @Post('login')
  @Public()
  async login(@Body() loginDto: CreateUserDto) {
    const tokens = await this.authService.login(loginDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Login successful',
      tokens,
    };
  }

  @Post('refresh')
  async refresh(@Body() refreshTokenDto: string) {
    if (!refreshTokenDto) {
      throw new UnauthorizedException('Refresh token is not valid');
    }

    const tokens = await this.authService.refresh(refreshTokenDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Tokens refreshed successfully',
      tokens,
    };
  }
}
