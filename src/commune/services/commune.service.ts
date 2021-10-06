import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommuneDto } from '../dto/create-commune.dto';
import { UpdateCommuneDto } from '../dto/update-commune.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { CommuneRepository } from '../repositories/commune.repository';
import { Commune } from '../entities/commune.entity';
import { GetCommunesFilterDto } from '../dto/get-communes-filter.dto';

@Injectable()
export class CommuneService {
  constructor(
    @InjectRepository(CommuneRepository)
    private readonly communeRepository: CommuneRepository,
  ) {}

  async createCommune(createCommuneDto: CreateCommuneDto): Promise<Commune> {
    return await this.communeRepository.createCommune(createCommuneDto);
  }

  async getCommunes(filterDto: GetCommunesFilterDto): Promise<Commune[]> {
    return await this.communeRepository.getCommunes(filterDto);
  }

  async getCommuneById(code: string) {
    const found = await this.communeRepository.findOne(code);

    if (!found) {
      throw new NotFoundException(`Commune with code "${code}" not found`);
    }
    return found;
  }

  async updateCommune(code: string, updateCommuneDto: UpdateCommuneDto) {
    return await this.communeRepository.updateCommune(code, updateCommuneDto);
  }

  async removeCommune(code: string): Promise<void> {
    try {
      const commune = await this.getCommuneById(code);
      await this.communeRepository.softRemove<Commune>(commune);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
