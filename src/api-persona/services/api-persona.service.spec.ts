import { Test, TestingModule } from '@nestjs/testing';
import { ApiPersonaService } from './api-persona.service';
import { CacheService } from '../../cache/services/cache.service';
import { ConfigService } from '@nestjs/config';
import { CacheRepository } from '../../cache/repositories/cache.repository';

describe('ApiPersonaService', () => {
  let service: ApiPersonaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApiPersonaService,
        ConfigService,
        CacheService,
        CacheRepository,
      ],
    }).compile();

    service = module.get<ApiPersonaService>(ApiPersonaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
