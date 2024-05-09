import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { HashingService } from 'src/utils/hashing.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { UsersRepository } from 'src/users/users.repository';
import { GoogleStrategy } from './strategies/google.strategy';
import { OAuth2Client } from 'google-auth-library';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET_KEY'),
        signOptions: { expiresIn: '1d' },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    HashingService,
    JwtStrategy,
    GoogleStrategy,
    UsersRepository,
    {
      provide: OAuth2Client,
      useFactory: () => {
        return new OAuth2Client(
          process.env.GOOGLE_CLIENT_ID,
          process.env.GOOGLE_CLIENT_SECRET,
          'http://localhost:4000/auth/google/callback',
        );
      },
    },
  ],
  exports: [AuthService],
})
export class AuthModule {}
