import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import { Module } from '@nestjs/common';
import { Config } from 'src/config';
import { redisStore } from 'cache-manager-ioredis-yet';
import { CacheService } from './cache.service';

@Module({
  imports: [
    NestCacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => {
        return {
          ...Config.redis,
          store: redisStore,
        };
      },
    }),
  ],
  controllers: [],
  providers: [CacheService],
})
export class CacheModule {}
