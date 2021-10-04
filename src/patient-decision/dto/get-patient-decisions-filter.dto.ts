import { IsOptional, IsString } from 'class-validator';

export class GetPatientDecisionsFilterDto {
  @IsOptional() @IsString() name?: string;
}
