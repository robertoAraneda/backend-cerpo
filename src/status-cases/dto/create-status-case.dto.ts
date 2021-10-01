import { IsNotEmpty, IsString } from 'class-validator';

export class CreateStatusCaseDto {
  @IsNotEmpty() @IsString() name: string;

  @IsNotEmpty() @IsString() description: string;

  @IsNotEmpty() @IsString() color: string;
}
