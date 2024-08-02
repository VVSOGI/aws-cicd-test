import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { RedisRepository } from './redis.repository';

@Injectable()
export class RedisService {
  logger = new Logger('RedisService');

  constructor(private readonly redisRepository: RedisRepository) {}

  async get(key: string) {
    const value = await this.redisRepository.get(key);
    if (!value) {
      this.logger.warn(`Key ${key} not found`);
      throw new NotFoundException(`Key ${key} not found`);
    }
    return this.redisRepository.get(key);
  }

  async set(key: string, value: string) {
    return this.redisRepository.set(key, value);
  }
}
