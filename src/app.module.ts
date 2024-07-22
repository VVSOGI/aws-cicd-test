import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './users/users.module';
import { BoardsModule } from './boards/boards.module';
import { MulterModule } from '@nestjs/platform-express';
import { Config, isDevelopment } from './config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MulterModule.register({
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
          return callback(new Error('Only image files are allowed!'), false);
        }
        callback(null, true);
      },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: Config.db.host,
      port: Config.db.port,
      password: Config.db.password,
      username: Config.db.username,
      entities: [__dirname + '/**/*.entity{.js,.ts}'],
      database: Config.db.database,
      synchronize: false,
      logging: isDevelopment() ? true : false,
    }),
    AuthModule,
    UserModule,
    BoardsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
