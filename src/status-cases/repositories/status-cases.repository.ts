import { EntityRepository, Repository } from 'typeorm';
import { StatusCase } from '../entities/status-case.entity';
import { CreateStatusCaseDto } from '../dto/create-status-case.dto';
import { UpdateStatusCaseDto } from '../dto/update-status-case.dto';
import { GetStatusCasesFilterDto } from '../dto/get-status-cases-filter.dto';

@EntityRepository(StatusCase)
export class StatusCasesRepository extends Repository<StatusCase> {
  async getStatusCases(
    filterDto: GetStatusCasesFilterDto,
  ): Promise<StatusCase[]> {
    const { name } = filterDto;

    const query = this.createQueryBuilder('delivery_route');

    if (name) {
      query.andWhere('delivery_route.name ILIKE :name', { name: `%${name}%` });
    }

    return await query.getMany();
  }

  async createStatusCase(
    createStatusCaseDto: CreateStatusCaseDto,
  ): Promise<StatusCase> {
    const statusCase = new StatusCase(createStatusCaseDto);

    return await this.save(statusCase);
  }

  async updateStatusCase(
    id: string,
    updateStatusCaseDto: UpdateStatusCaseDto,
  ): Promise<StatusCase> {
    const statusCase = await this.findOne(id);

    this.merge(statusCase, updateStatusCaseDto);

    return await this.save(statusCase);
  }
}
