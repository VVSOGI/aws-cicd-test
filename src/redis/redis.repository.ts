import Redis from 'ioredis';
import { Injectable } from '@nestjs/common';
import { Config } from 'src/config';

@Injectable()
export class RedisRepository {
  private readonly redisClient: Redis;

  constructor() {
    this.redisClient = new Redis(Config.redis);
  }

  async get(key: string) {
    return this.redisClient.get(key);
  }

  async set(key: string, value: string) {
    return this.redisClient.setex(key, 10, value);
  }
}
