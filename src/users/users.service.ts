import { Injectable, Logger } from '@nestjs/common';
import { UsersRepository } from './users.repository';
import { HashingService } from 'src/utils/hashing.service';
import { GoogleProfile } from 'src/auth/types';
import { CreateUser } from './types/types';

@Injectable()
export class UsersService {
  constructor(
    private usersRepository: UsersRepository,
    private hashingService: HashingService,
  ) {}

  private async create(user: CreateUser) {
    const hasedPassword = await this.hashingService.hashPassword(user.password);
    await this.usersRepository.isUserExist(user.email);
    return this.usersRepository.create({
      nickname: user.nickname,
      email: user.email,
      password: hasedPassword,
      phoneNumber: user.phoneNumber,
    });
  }

  async register(createUser: CreateUser) {
    return this.create(createUser);
  }

  async createGoogleUser(profile: GoogleProfile) {
    const { id, email, name, picture } = profile;

    try {
      await this.usersRepository.findUserById(id);
      return;
    } catch (error) {
      Logger.log(`[AuthService] log in createGoogleUser: ${error.message}`);
      await this.usersRepository.googleAuthCreate({
        id,
        email,
        nickname: name,
        password: null,
        phoneNumber: null,
        profileImage: picture,
      });
    }
  }
}
