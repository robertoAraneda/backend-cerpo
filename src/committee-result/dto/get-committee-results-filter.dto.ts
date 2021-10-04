import { IsOptional, IsString } from 'class-validator';

export class GetCommitteeResultsFilterDto {
  @IsOptional() @IsString() name?: string;
}
