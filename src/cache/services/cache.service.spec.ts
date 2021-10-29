import { Test, TestingModule } from '@nestjs/testing';
import { CacheService } from './cache.service';
import { CacheRepository } from '../repositories/cache.repository';
import { Cache } from '../entities/cache.entity';
import { CachesStub } from '../stubs/caches.stub';
import { CreateCacheDto } from '../dto/create-cache.dto';
import { UpdateCacheDto } from '../dto/update-cache.dto';
import CreateCacheStub from '../stubs/create-cache.stub';

describe('CacheService', () => {
  let service: CacheService;
  let repository: CacheRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CacheService, CacheRepository],
    }).compile();

    service = module.get<CacheService>(CacheService);
    repository = module.get<CacheRepository>(CacheRepository);
  });

  it('should service be defined', () => {
    expect(service).toBeDefined();
  });

  it('should repository be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('GetCaches', () => {
    it('should return and array of Caches', async () => {
      const result: Cache[] = CachesStub.getAll();

      jest
        .spyOn(repository, 'getCached')
        .mockImplementation(async () => result);

      expect(await service.findAll()).toBe(result);
      expect(repository.getCached).toHaveBeenCalled();
    });
  });

  describe('CreateCache', () => {
    it('should create one cache', async () => {
      const createCacheDto: CreateCacheDto = CreateCacheStub();
      const result: Cache = CachesStub.getOne();

      jest
        .spyOn(repository, 'createCache')
        .mockImplementation(async () => result);

      expect(await service.create(createCacheDto)).toBe(result);
      expect(repository.createCache).toHaveBeenCalled();
    });
  });

  describe('UpdateCache', () => {
    it('should update one cache', async () => {
      const cache: Cache = CachesStub.getOne();

      const updateCacheDto: UpdateCacheDto = {
        value: 'New value Cache',
      };

      jest
        .spyOn(repository, 'updateCache')
        .mockImplementation(async () => cache);

      expect(await service.update(cache.id, updateCacheDto)).toBe(cache);
      expect(repository.updateCache).toHaveBeenCalled();
    });
  });
});
