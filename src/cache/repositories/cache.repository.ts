import { EntityRepository, Repository } from 'typeorm';
import { Logger } from '@nestjs/common';
import { Cache } from '../entities/cache.entity';
import { UpdateCacheDto } from '../dto/update-cache.dto';
import { CreateCacheDto } from '../dto/create-cache.dto';

@EntityRepository(Cache)
export class CacheRepository extends Repository<Cache> {
  private logger = new Logger('CacheRepository');

  async getCached(): Promise<Cache[]> {
    return await this.find();
  }

  async createCache(createCacheDto: CreateCacheDto): Promise<Cache> {
    const cached = new Cache(createCacheDto);

    this.logger.verbose(`User "${JSON.stringify(cached)}" store result`);

    return await this.save(cached);
  }

  async updateCache(
    id: number,
    updateCacheDto: UpdateCacheDto,
  ): Promise<Cache> {
    const cached = await this.findOne(id);

    this.merge(cached, updateCacheDto);

    return await this.save(cached);
  }
}
