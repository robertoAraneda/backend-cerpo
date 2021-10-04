import { EntityRepository, Repository } from 'typeorm';
import { System } from '../entities/system.entity';
import { CreateSystemDto } from '../dto/create-system.dto';
import { UpdateSystemDto } from '../dto/update-system.dto';
import { GetSystemsFilterDto } from '../dto/get-systems-filter.dto';

@EntityRepository(System)
export class SystemRepository extends Repository<System> {
  async getSystems(filterDto: GetSystemsFilterDto): Promise<System[]> {
    const { name } = filterDto;

    const query = this.createQueryBuilder('system');

    if (name) {
      query.andWhere('system.name ILIKE :name', { name: `%${name}%` });
    }

    return await query.getMany();
  }

  async createSystem(createSystemDto: CreateSystemDto): Promise<System> {
    const system = new System(createSystemDto);

    return await this.save(system);
  }

  async updateSystem(
    id: number,
    updateSystemDto: UpdateSystemDto,
  ): Promise<System> {
    const system = await this.findOne(id);

    this.merge(system, updateSystemDto);

    return await this.save(system);
  }
}
