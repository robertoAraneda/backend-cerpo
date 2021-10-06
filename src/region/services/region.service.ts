import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateRegionDto } from '../dto/create-region.dto';
import { UpdateRegionDto } from '../dto/update-region.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { RegionRepository } from '../repositories/region.repository';
import { Region } from '../entities/region.entity';
import { GetRegionsFilterDto } from '../dto/get-regions-filter.dto';

@Injectable()
export class RegionService {
  constructor(
    @InjectRepository(RegionRepository)
    private readonly regionsRepository: RegionRepository,
  ) {}

  async createRegion(createRegionDto: CreateRegionDto): Promise<Region> {
    return await this.regionsRepository.createRegion(createRegionDto);
  }

  async getRegions(filterDto: GetRegionsFilterDto): Promise<Region[]> {
    return await this.regionsRepository.getRegions(filterDto);
  }

  async getRegionById(code: string) {
    const found = await this.regionsRepository.findOne(code);

    if (!found) {
      throw new NotFoundException(`Region with code "${code}" not found`);
    }
    return found;
  }

  async updateRegion(code: string, updateRegionDto: UpdateRegionDto) {
    return await this.regionsRepository.updateRegion(code, updateRegionDto);
  }

  async removeRegion(code: string): Promise<void> {
    try {
      const region = await this.getRegionById(code);
      await this.regionsRepository.softRemove<Region>(region);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
