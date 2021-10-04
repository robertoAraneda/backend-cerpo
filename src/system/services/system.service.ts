import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateSystemDto } from '../dto/create-system.dto';
import { UpdateSystemDto } from '../dto/update-system.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { SystemRepository } from '../repositories/system.repository';
import { System } from '../entities/system.entity';
import { GetSystemsFilterDto } from '../dto/get-systems-filter.dto';

@Injectable()
export class SystemService {
  constructor(
    @InjectRepository(SystemRepository)
    private readonly systemsRepository: SystemRepository,
  ) {}

  async createSystem(createSystemDto: CreateSystemDto): Promise<System> {
    return await this.systemsRepository.createSystem(createSystemDto);
  }

  async getSystems(filterDto: GetSystemsFilterDto): Promise<System[]> {
    return await this.systemsRepository.getSystems(filterDto);
  }

  async getSystemById(id: number) {
    const found = await this.systemsRepository.findOne(id);

    if (!found) {
      throw new NotFoundException(`System with ID "${id}" not found`);
    }
    return found;
  }

  async updateSystem(id: number, updateSystemDto: UpdateSystemDto) {
    return await this.systemsRepository.updateSystem(id, updateSystemDto);
  }

  async removeSystem(id: number): Promise<void> {
    try {
      const system = await this.getSystemById(id);
      await this.systemsRepository.softRemove<System>(system);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
