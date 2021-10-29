import { Module } from '@nestjs/common';
import { UserController } from './controllers/user.controller';
import { UserService } from './services/user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRepository } from './repositories/user.repository';
import { ApiPersonaService } from '../api-persona/services/api-persona.service';
import { CacheService } from '../cache/services/cache.service';
import { CacheRepository } from '../cache/repositories/cache.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository, CacheRepository])],
  controllers: [UserController],
  providers: [UserService, ApiPersonaService, CacheService],
})
export class UserModule {}
