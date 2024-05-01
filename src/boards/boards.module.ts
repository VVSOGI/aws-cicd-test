import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardsController } from './boards.controller';
import { BoardsRepository } from './boards.repository';
import { BoardsService } from './boards.service';
import { Board } from './entities/boards.entity';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Board]), AuthModule],
  controllers: [BoardsController],
  providers: [BoardsService, BoardsRepository, JwtStrategy],
})
export class BoardsModule {}
