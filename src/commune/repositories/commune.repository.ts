import { EntityRepository, Repository } from 'typeorm';
import { Commune } from '../entities/commune.entity';
import { CreateCommuneDto } from '../dto/create-commune.dto';
import { UpdateCommuneDto } from '../dto/update-commune.dto';
import { GetCommunesFilterDto } from '../dto/get-communes-filter.dto';

@EntityRepository(Commune)
export class CommuneRepository extends Repository<Commune> {
  async getCommunes(filterDto: GetCommunesFilterDto): Promise<Commune[]> {
    const { name } = filterDto;

    const query = this.createQueryBuilder('commune');

    if (name) {
      query.andWhere('commune.name ILIKE :name', { name: `%${name}%` });
    }

    return await query.leftJoinAndSelect('commune.region', 'region').getMany();
  }

  async createCommune(createCommuneDto: CreateCommuneDto): Promise<Commune> {
    const commune = new Commune(createCommuneDto);

    return await this.save(commune);
  }

  async updateCommune(
    code: string,
    updateCommuneDto: UpdateCommuneDto,
  ): Promise<Commune> {
    const commune = await this.findOne(code);

    this.merge(commune, updateCommuneDto);

    return await this.save(commune);
  }
}
