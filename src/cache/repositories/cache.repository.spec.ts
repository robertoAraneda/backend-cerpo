import { Connection } from 'typeorm';
import { CacheRepository } from './cache.repository';
import { Test, TestingModule } from '@nestjs/testing';
import { createMemDB } from '../../config/create-memory-database';
import CreateCacheStub from '../stubs/create-cache.stub';
import { Cache } from '../entities/cache.entity';
import { UpdateCacheDto } from '../dto/update-cache.dto';
import { CachesStub } from '../stubs/caches.stub';

describe('CacheRepository', () => {
  let repository: CacheRepository;
  let db: Connection;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [],
    }).compile();
    db = await createMemDB();
    repository = db.getCustomRepository<CacheRepository>(CacheRepository);
  });

  afterEach(() => db.close());

  it('should repository be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('getCaches', () => {
    beforeEach(async () => {
      await Promise.all(
        CachesStub.getAll().map(async (cache) => {
          await repository.createCache(cache);
        }),
      );
    });

    it('should return and array of Caches', async () => {
      const mockedCaches: Cache[] = CachesStub.getAll();
      jest.spyOn(repository, 'getCached');

      const caches = await repository.find();

      expect(await repository.getCached()).toStrictEqual(caches);
      expect(repository.getCached).toBeCalledTimes(1);
      expect(caches.length).toBe(mockedCaches.length);
    });
  });

  describe('createCache', () => {
    it('should create one cache', async () => {
      jest.spyOn(repository, 'createCache');

      const cache: Cache = await repository.createCache(CreateCacheStub());

      expect(repository.createCache).toBeCalledTimes(1);
      expect(cache.constructor.name).toBe('Cache');
      expect(await repository.count()).toBe(1);
    });
  });

  describe('updateCache', () => {
    it('should updated one committeeResult', async () => {
      jest.spyOn(repository, 'updateCache');

      const committeeResult: Cache = await repository.createCache(
        CreateCacheStub(),
      );

      const updateCacheDto: UpdateCacheDto = {
        value: 'new value Cache',
      };

      const updatedCache: Cache = await repository.updateCache(
        committeeResult.id,
        updateCacheDto,
      );

      expect(repository.updateCache).toBeCalledTimes(1);
      expect(updatedCache.constructor.name).toBe('Cache');
      expect(updatedCache.value).toBe(updateCacheDto.value);
    });
  });
});
