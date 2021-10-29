import { Test, TestingModule } from '@nestjs/testing';
import { ApiPersonaService } from './api-persona.service';

describe('ApiPersonaService', () => {
  let service: ApiPersonaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ApiPersonaService],
    }).compile();

    service = module.get<ApiPersonaService>(ApiPersonaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
