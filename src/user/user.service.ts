import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateUserDto } from './create-user.dto';
import { UpdatePasswordDto } from './update-password.dto';
import { UserEntity } from './user.entity';
import { User } from './user.interface';
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

@Injectable()
export class UserService {
  async getAll(): Promise<Omit<UserEntity, 'password'>[]> {
    const users = await prisma.user.findMany();

    return users.map((user) => {
      const { createdAt, updatedAt, id, login, version } = user;

      return {
        createdAt: new Date(createdAt).getTime(),
        updatedAt: new Date(updatedAt).getTime(),
        id,
        login,
        version,
      };
    });
  }

  async getUser(id: string): Promise<Omit<UserEntity, 'password'>> {
    try {
      const current = await prisma.user.findUniqueOrThrow({
        where: { id },
      });

      const { createdAt, updatedAt, login, version } = current;

      return {
        createdAt: new Date(createdAt).getTime(),
        updatedAt: new Date(updatedAt).getTime(),
        id,
        login,
        version,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
    }
  }

  async getUserByLogin(
    login: string,
  ): Promise<Pick<User, 'id' | 'login' | 'password'>> {
    try {
      return await prisma.user.findFirstOrThrow({
        where: { login },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
    }
  }

  async post(dto: CreateUserDto): Promise<Omit<UserEntity, 'password'>> {
    const { id, createdAt, updatedAt, login, version } =
      await prisma.user.create({
        data: dto,
      });

    return {
      createdAt: new Date(createdAt).getTime(),
      updatedAt: new Date(updatedAt).getTime(),
      id,
      login,
      version,
    };
  }

  async put(id, dto: UpdatePasswordDto): Promise<Omit<UserEntity, 'password'>> {
    try {
      const current = await prisma.user.findUniqueOrThrow({
        where: { id },
      });

      const { oldPassword, newPassword } = dto;

      if (current.password === oldPassword) {
        const { createdAt, updatedAt, login, version } =
          await prisma.user.update({
            where: { id },
            data: {
              password: newPassword,
              version: current.version + 1,
            },
          });

        return {
          createdAt: new Date(createdAt).getTime(),
          updatedAt: new Date(updatedAt).getTime(),
          id,
          login,
          version,
        };
      }
    } catch (error) {
      if (error.code === 'P2025') {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
    }

    throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
  }

  async delete(id: string) {
    try {
      await prisma.user.delete({
        where: { id },
      });
    } catch (error) {
      if (error.code === 'P2025') {
        throw new HttpException('User not found', HttpStatus.NOT_FOUND);
      }
    }
  }
}
