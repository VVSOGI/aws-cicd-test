import { Injectable } from '@nestjs/common';
import { HashingService } from 'src/utils/hashing.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersRepository } from './users.repository';

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
      nickname: user.nickname,
      email: user.email,
      password: hasedPassword,
      phoneNumber: user.phoneNumber,
    });
  }

  async register(createUserDto: CreateUserDto) {
    return this.create(createUserDto);
  }
}
