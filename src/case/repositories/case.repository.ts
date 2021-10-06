import { EntityRepository, Repository } from 'typeorm';
import { Case } from '../entities/case.entity';
import { CreateCaseDto } from '../dto/create-case.dto';
import { UpdateCaseDto } from '../dto/update-case.dto';
import { GetCasesFilterDto } from '../dto/get-cases-filter.dto';

@EntityRepository(Case)
export class CaseRepository extends Repository<Case> {
  async getCases(filterDto: GetCasesFilterDto): Promise<Case[]> {
    const { title } = filterDto;

    const query = this.createQueryBuilder('case');

    if (title) {
      query.andWhere('case.title ILIKE :title', { title: `%${title}%` });
    }

    return await query.leftJoinAndSelect('case.patient', 'patient').getMany();
  }

  async createCase(createCaseDto: CreateCaseDto): Promise<Case> {
    const caseEntity = new Case(createCaseDto);

    return await this.save(caseEntity);
  }

  async updateCase(id: number, updateCaseDto: UpdateCaseDto): Promise<Case> {
    const caseEntity = await this.findOne(id);

    this.merge(caseEntity, updateCaseDto);

    return await this.save(caseEntity);
  }
}
