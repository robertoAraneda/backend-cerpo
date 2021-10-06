import { IsNotEmpty, IsObject, IsString } from 'class-validator';
import { Region } from '../../region/entities/region.entity';

export class CreateCommuneDto {
  @IsNotEmpty() @IsString() name: string;
  @IsNotEmpty() @IsString() code: string;
  @IsNotEmpty() region: Region;
}
