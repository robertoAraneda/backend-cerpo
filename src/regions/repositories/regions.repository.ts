import { EntityRepository, Repository } from 'typeorm';
import { Region } from '../entities/region.entity';
import { CreateRegionDto } from '../dto/create-region.dto';
import { UpdateRegionDto } from '../dto/update-region.dto';
import { GetRegionsFilterDto } from '../dto/get-regions-filter.dto';

@EntityRepository(Region)
export class RegionsRepository extends Repository<Region> {
  async getRegions(filterDto: GetRegionsFilterDto): Promise<Region[]> {
    const { name } = filterDto;

    const query = this.createQueryBuilder('region');

    if (name) {
      query.andWhere('region.name ILIKE :name', { name: `%${name}%` });
    }

    return await query.getMany();
  }

  async createRegion(createRegionDto: CreateRegionDto): Promise<Region> {
    const region = new Region(createRegionDto);

    return await this.save(region);
  }

  async updateRegion(
    id: number,
    updateRegionDto: UpdateRegionDto,
  ): Promise<Region> {
    const region = await this.findOne(id);

    this.merge(region, updateRegionDto);

    return await this.save(region);
  }
}
