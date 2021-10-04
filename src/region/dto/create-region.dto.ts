import { IsNotEmpty, IsString } from 'class-validator';

export class CreateRegionDto {
  @IsNotEmpty() @IsString() name: string;

  @IsNotEmpty() @IsString() code: string;
}
