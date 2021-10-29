import { Injectable, NotImplementedException } from '@nestjs/common';
import { CreateCacheDto } from '../dto/create-cache.dto';
import { UpdateCacheDto } from '../dto/update-cache.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CacheRepository } from '../repositories/cache.repository';
import { Cache } from '../entities/cache.entity';

@Injectable()
export class CacheService {
  constructor(
    @InjectRepository(CacheRepository)
    private readonly cacheRepository: CacheRepository,
  ) {}
  async create(createCacheDto: CreateCacheDto) {
    return await this.cacheRepository.createCache(createCacheDto);
  }

  async findAll(): Promise<Cache[]> {
    return await this.cacheRepository.getCached();
  }

  findOne(id: number) {
    throw new NotImplementedException();
  }

  async update(id: number, updateCacheDto: UpdateCacheDto) {
    return await this.cacheRepository.updateCache(id, updateCacheDto);
  }

  async remove(id: number) {
    return await this.cacheRepository.delete({ id });
  }

  async findTokenByType(type: string) {
    return await this.cacheRepository.findOne({ type });
  }
}
