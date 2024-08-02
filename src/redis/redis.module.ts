import { Module } from '@nestjs/common';
import { RedisRepository } from './redis.repository';
import { RedisService } from './redis.service';

@Module({
  imports: [],
  controllers: [],
  providers: [RedisService, RedisRepository],
})
export class RedisModule {}
