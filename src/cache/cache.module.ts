import { Module } from '@nestjs/common';
import { RedisService } from './cache.service';

@Module({
  providers: [RedisService],
      exports: [RedisService],
})
export class CacheModule {}
