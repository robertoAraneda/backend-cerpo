import { IsNotEmpty, IsString } from 'class-validator';

export class GetApiPersonaDto {
  @IsNotEmpty() @IsString() rut: string;
}
