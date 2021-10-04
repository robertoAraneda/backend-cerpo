import { EntityRepository, Repository } from 'typeorm';
import { CommitteeResult } from '../entities/committee-result.entity';
import { CreateCommitteeResultDto } from '../dto/create-committee-result.dto';
import { UpdateCommitteeResultDto } from '../dto/update-committee-result.dto';
import { GetCommitteeResultsFilterDto } from '../dto/get-committee-results-filter.dto';

@EntityRepository(CommitteeResult)
export class CommitteeResultsRepository extends Repository<CommitteeResult> {
  async getCommitteeResults(
    filterDto: GetCommitteeResultsFilterDto,
  ): Promise<CommitteeResult[]> {
    const { name } = filterDto;

    const query = this.createQueryBuilder('committee_result');

    if (name) {
      query.andWhere('committee_result.name ILIKE :name', {
        name: `%${name}%`,
      });
    }

    return await query.getMany();
  }

  async createCommitteeResult(
    createCommitteeResultDto: CreateCommitteeResultDto,
  ): Promise<CommitteeResult> {
    const committeeResult = new CommitteeResult(createCommitteeResultDto);

    return await this.save(committeeResult);
  }

  async updateCommitteeResult(
    id: number,
    updateCommitteeResultDto: UpdateCommitteeResultDto,
  ): Promise<CommitteeResult> {
    const committeeResult = await this.findOne(id);

    this.merge(committeeResult, updateCommitteeResultDto);

    return await this.save(committeeResult);
  }
}
