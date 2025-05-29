import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { v4 } from 'uuid';
import { users } from '../_db/db';
import { CreateUserDto } from './create-user.dto';
import { UpdatePasswordDto } from './update-password.dto';
import { UserEntity } from './user.entity';

@Injectable()
export class UserService {
  getAll(): UserEntity[] {
    return users;
  }

  getUser(id: string): UserEntity {
    const current = users.find((user) => user.id === id);
    if (current) {
      return current;
    }

    throw new HttpException('Not found', HttpStatus.NOT_FOUND);
  }

  post(dto: CreateUserDto): UserEntity {
    const { login, password } = dto;
    const id = v4();
    const date = Date.now();
    const user = new UserEntity({
      id,
      login,
      password,
      version: 1,
      createdAt: date,
      updatedAt: date,
    });

    users.push(user);

    return user;
  }

  put(id, dto: UpdatePasswordDto): UserEntity {
    const index = users.findIndex((user) => user.id === id);
    if (index !== -1) {
      const { oldPassword, newPassword } = dto;
      if (users[index].password === oldPassword) {
        users[index].password = newPassword;
        users[index].version += 1;
        users[index].updatedAt = Date.now();

        return users[index];
      }
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    throw new HttpException('Not found', HttpStatus.NOT_FOUND);
  }

  delete(id: string) {
    const index = users.findIndex((user) => user.id === id);

    if (index !== -1) {
      users.splice(index, 1);
      return;
    }

    throw new HttpException('Not found', HttpStatus.NOT_FOUND);
  }
}
