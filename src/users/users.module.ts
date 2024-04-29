import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { ConfigModule } from '@nestjs/config';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { UsersRepository } from '../users/users.repository';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { HashingService } from 'src/utils/hashing.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    ConfigModule.forRoot({ isGlobal: true }),
  ],
  controllers: [UsersController],
  providers: [UsersService, HashingService, JwtStrategy, UsersRepository],
})
export class UserModule {}
