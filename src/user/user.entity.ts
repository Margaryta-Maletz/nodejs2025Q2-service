import { User } from './user.interface';
import { Exclude } from 'class-transformer';

export class UserEntity implements User {
  id: string;
  login: string;
  @Exclude()
  password: string;
  version: number;
  createdAt: number;
  updatedAt: number;

  constructor(user: Partial<UserEntity>) {
    this.id = user.id;
    this.login = user.login;
    this.password = user.password;
    this.version = user.version;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }
}
