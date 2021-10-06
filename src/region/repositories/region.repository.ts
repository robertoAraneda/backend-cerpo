import { EntityRepository, Repository } from 'typeorm';
import { Region } from '../entities/region.entity';
import { CreateRegionDto } from '../dto/create-region.dto';
import { UpdateRegionDto } from '../dto/update-region.dto';
import { GetRegionsFilterDto } from '../dto/get-regions-filter.dto';

@EntityRepository(Region)
export class RegionRepository extends Repository<Region> {
  async getRegions(filterDto: GetRegionsFilterDto): Promise<Region[]> {
    const { name } = filterDto;

    const query = this.createQueryBuilder('region');

    if (name) {
      query.andWhere('region.name ILIKE :name', { name: `%${name}%` });
    }

    return await query
      .leftJoinAndSelect('region.communes', 'communes')
      .getMany();
  }

  async createRegion(createRegionDto: CreateRegionDto): Promise<Region> {
    const region = new Region(createRegionDto);

    return await this.save(region);
  }

  async updateRegion(
    code: string,
    updateRegionDto: UpdateRegionDto,
  ): Promise<Region> {
    const region = await this.findOne(code);

    this.merge(region, updateRegionDto);

    return await this.save(region);
  }
}
