import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCacheDto {
  @IsNotEmpty() @IsString() value: string;
  @IsNotEmpty() @IsString() expiresIn: number;
  @IsNotEmpty() @IsString() type: string;
}
