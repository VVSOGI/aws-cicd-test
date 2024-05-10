import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateGoogleUser, CreateUser, UpdatePermissions } from './types/types';
import { User } from './entities/user.entity';
import { v4 } from 'uuid';

@Injectable()
export class UsersRepository {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async findUserById(id: string) {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('User wasn`t founded');
    }
    return user;
  }

  async findUserByEmail(email: string) {
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('User wasn`t founded');
    }
    return user;
  }

  async create(user: CreateUser) {
    const { nickname, email, password, phoneNumber } = user;
    const createUser = this.usersRepository.create({
      id: v4(),
      nickname,
      email,
      password,
      phoneNumber,
      profileImage: process.env.AWS_S3_PROFILE_URL,
    });
    await this.usersRepository.save(createUser);
  }

  async googleAuthCreate(user: CreateGoogleUser) {
    const { id, nickname, email, password, phoneNumber, profileImage } = user;
    const createUser = this.usersRepository.create({
      id,
      nickname,
      email,
      password,
      phoneNumber,
      profileImage,
    });
    await this.usersRepository.save(createUser);
  }

  async isUserExist(email: string) {
    if (await this.usersRepository.findOne({ where: { email } })) {
      throw new BadRequestException('User already exist');
    }
  }

  async updateUserPermission(updatePermissions: UpdatePermissions) {
    const user = await this.usersRepository.findOne({
      where: { id: updatePermissions.id },
    });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.permission = updatePermissions.permission;
    await this.usersRepository.save(user);
  }
}
