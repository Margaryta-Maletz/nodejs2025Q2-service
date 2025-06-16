import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { CreateUserDto } from '../user/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  private readonly saltRounds: number;

  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {
    this.saltRounds = parseInt(process.env.CRYPT_SALT, 10) || 10;
  }

  async signup(signupDto: CreateUserDto) {
    const { login, password } = signupDto;
    const encryptedPassword = bcrypt.hashSync(password, this.saltRounds);
    return await this.userService.post({
      login,
      password: encryptedPassword,
    });
  }

  async login(loginDto: CreateUserDto) {
    const user = await this.userService.getUserByLogin(loginDto.login);

    if (!user) {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }

    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );

    if (isPasswordValid) {
      const payload = { userId: user.id, login: user.login };

      const newAccessToken = this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET_KEY,
        expiresIn: process.env.TOKEN_EXPIRE_TIME,
      });
      const newRefreshToken = this.jwtService.sign(payload, {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
        expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
      });

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } else {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }

  async refresh(refreshToken: string) {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
      });
      const user = await this.userService.getUser(payload.userId);
      if (!user) {
        throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
      }

      const newPayload = { userId: user.id, login: user.login };
      const newAccessToken = this.jwtService.sign(newPayload, {
        secret: process.env.JWT_SECRET_KEY,
        expiresIn: process.env.TOKEN_EXPIRE_TIME,
      });
      const newRefreshToken = this.jwtService.sign(newPayload, {
        secret: process.env.JWT_SECRET_REFRESH_KEY,
        expiresIn: process.env.TOKEN_REFRESH_EXPIRE_TIME,
      });
      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }
  }
}
