import { Module } from '@nestjs/common';
import { CacheService } from './services/cache.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CacheRepository } from './repositories/cache.repository';

@Module({
  imports: [TypeOrmModule.forFeature([CacheRepository])],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
