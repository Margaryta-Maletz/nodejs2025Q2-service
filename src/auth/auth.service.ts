import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/create-user.dto';
import * as bcrypt from 'bcrypt';
import { LoggingService } from '../logging/logging.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private loggingService: LoggingService,
  ) {}

  async signup(signupDto: CreateUserDto) {
    return await this.userService.post(signupDto);
  }

  async login(loginDto: CreateUserDto) {
    const user = await this.userService.getUserByLogin(loginDto.login);

    if (await bcrypt.compare(user.password, loginDto.password)) {
      const payload = { userId: user.id, login: user.login };
      return {
        accessToken: this.jwtService.sign(payload, {
          expiresIn: process.env.TOKEN_EXPIRE_TIME,
        }),
        refreshToken: this.jwtService.sign(payload, {
          expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
        }),
      };
    }

    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }

  async refresh(refreshToken: string) {
    const payload = this.jwtService.verify(refreshToken, {
      secret: process.env.JWT_SECRET_REFRESH_KEY,
    });
    const user = await this.userService.getUser(payload.userId);
    if (!user) {
      this.loggingService.error('Refresh token verification failed');
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    const newPayload = { userId: user.id, login: user.login };
    return {
      accessToken: this.jwtService.sign(newPayload, {
        expiresIn: process.env.TOKEN_EXPIRE_TIME,
      }),
      refreshToken: this.jwtService.sign(newPayload, {
        expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
      }),
    };
  }
}
