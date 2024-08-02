import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';

@Injectable()
export class CacheService {
  logger = new Logger('CacheService');
  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

  async get(key: string) {
    const value = await this.cacheManager.get(key);
    if (!value) {
      this.logger.warn(`Key ${key} not found`);
      throw new NotFoundException(`Key ${key} not found`);
    }
    return this.cacheManager.get(key);
  }

  async set(key: string, value: string, ttl: number = 10000) {
    return this.cacheManager.set(key, value, ttl);
  }
}
