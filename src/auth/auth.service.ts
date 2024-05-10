import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository';
import { LoginUserDto } from './dto/login-user.dto';
import { HashingService } from 'src/utils/hashing.service';
import { User } from '../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private hashingService: HashingService,
    private jwtService: JwtService,
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
      phoneNumber: findUser.phoneNumber,
      profileImage: findUser.profileImage,
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
    const googleLoginUrl = `https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&scope=profile email&prompt=consent&response_type=code&client_id=${process.env.GOOGLE_CLIENT_ID}&redirect_uri=${process.env.GOOGLE_REDIRECT_URI}`;
    return googleLoginUrl;
  }

  async getGoogleToken(code: string) {
    const response = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      body: JSON.stringify({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: process.env.GOOGLE_REDIRECT_URI,
        grant_type: 'authorization_code',
      }),
    });

    const token = await response.json();
    return token;
  }

  async getGoogleProfile(accessToken: string) {
    const getProfiles = await fetch(
      `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${accessToken}`,
    );
    const profile = await getProfiles.json();
    return profile;
  }
}
