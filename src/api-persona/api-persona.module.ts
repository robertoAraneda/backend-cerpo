import { Module } from '@nestjs/common';
import { ApiPersonaService } from './services/api-persona.service';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '../cache/cache.module';
import { CacheService } from '../cache/services/cache.service';

@Module({
  imports: [CacheModule],
  providers: [ApiPersonaService, ConfigModule],
})
export class ApiPersonaModule {}
