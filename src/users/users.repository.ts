import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 } from 'uuid';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import { UpdatePermissions } from './types/types';

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

  async create(user: CreateUserDto) {
    const { email, password } = user;
    const createUser = this.usersRepository.create({
      id: v4(),
      email,
      password,
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
