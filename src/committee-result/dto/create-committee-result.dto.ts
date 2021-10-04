import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCommitteeResultDto {
  @IsNotEmpty() @IsString() name: string;
}
