import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BoardsController } from './boards.controller';
import { BoardsRepository } from './boards.repository';
import { BoardsService } from './boards.service';
import { Board } from './entities/boards.entity';
import { JwtStrategy } from 'src/auth/strategies/jwt.strategy';
import { AuthModule } from 'src/auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Module({
  imports: [
    TypeOrmModule.forFeature([Board]),
    MulterModule.register({
      storage: diskStorage({
        destination: './uploads', // 파일을 저장할 서버 내 경로
        filename: (req, file, cb) => {
          const uniqueSuffix =
            Date.now() + '-' + Math.round(Math.random() * 1e9);
          const extension = file.originalname.split('.').pop();
          cb(null, `${uniqueSuffix}.${extension}`); // 파일명 설정
        },
      }),
    }),
    AuthModule,
  ],
  controllers: [BoardsController],
  providers: [BoardsService, BoardsRepository, JwtStrategy],
})
export class BoardsModule {}
