import { Injectable } from '@nestjs/common';
import { HashingService } from 'src/utils/hashing.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';

interface UpdatePermissions {
  id: string;
  permission: string;
}

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private hashingService: HashingService,
  ) {}

  private async create(user: CreateUserDto) {
    const hasedPassword = await this.hashingService.hashPassword(user.password);
    await this.usersRepository.isUserExist(user.email);
    return this.usersRepository.create({
      email: user.email,
      password: hasedPassword,
    });
  }

  async register(createUserDto: CreateUserDto) {
    return this.create(createUserDto);
  }
}
