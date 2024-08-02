import { Injectable } from '@nestjs/common';
import { RedisRepository } from './redis.repository';

@Injectable()
export class RedisService {
  constructor(private readonly redisRepository: RedisRepository) {}

  async get(key: string) {
    return this.redisRepository.get(key);
  }

  async set(key: string, value: string) {
    return this.redisRepository.set(key, value);
  }
}
