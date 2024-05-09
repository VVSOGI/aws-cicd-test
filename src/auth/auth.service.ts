import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import { LoginUserDto } from './dto/login-user.dto';
import { HashingService } from 'src/utils/hashing.service';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { OAuth2Client } from 'google-auth-library';
import { GoogleProfile } from './types';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private hashingService: HashingService,
    private jwtService: JwtService,
    private readonly oauth2Client: OAuth2Client,
  ) {}

  private async checkPassword(user: User, password: string) {
    const isMatch = await this.hashingService.comparePasswords(
      password,
      user.password,
    );
    if (!isMatch) {
      throw new UnauthorizedException('Incorrect password');
    }
  }

  private async generateToken(user: User) {
    const accessToken = await this.jwtService.signAsync(
      { id: user.id, email: user.email },
      { expiresIn: `${process.env.JWT_ACCESS_TOKEN_EXPIRATION_TIME}s` },
    );
    const refreshToken = await this.jwtService.signAsync(
      { id: user.id, email: user.email },
      { expiresIn: `${process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME}s` },
    );
    return { accessToken, refreshToken };
  }

  async login(user: LoginUserDto) {
    const { email, password } = user;
    const foundUsers = await this.usersRepository.findUserByEmail(email);
    await this.checkPassword(foundUsers, password);
    const { accessToken, refreshToken } = await this.generateToken(foundUsers);
    return { accessToken, refreshToken };
  }

  async profile(id: string) {
    const findUser = await this.usersRepository.findUserById(id);
    return {
      id: findUser.id,
      nickname: findUser.nickname,
      email: findUser.email,
      permission: findUser.permission,
    };
  }

  async adminCheck(id: string) {
    const { permission } = await this.usersRepository.findUserById(id);
    if (permission !== 'admin') {
      throw new UnauthorizedException('Only admin can update permission.');
    }
    return true;
  }

  async refresh(id: string) {
    const user = await this.usersRepository.findUserById(id);
    const accessToken = await this.jwtService.signAsync(
      { id: user.id, email: user.email },
      { expiresIn: `${process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME}s` },
    );

    return { accessToken };
  }

  async getGoogleLoginUrl(): Promise<string> {
    const googleLoginUrl = this.oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['profile', 'email'],
      prompt: 'consent',
    });
    console.log(googleLoginUrl);
    return googleLoginUrl;
  }

  async createGoogleUser(profile: GoogleProfile) {
    const { id, email, name } = profile;

    try {
      await this.usersRepository.findUserById(id);
      return;
    } catch (error) {
      console.log(error);
      await this.usersRepository.googleAuthCreate({
        id,
        email,
        nickname: name,
        password: null,
        phoneNumber: null,
      });
    }
  }
}
