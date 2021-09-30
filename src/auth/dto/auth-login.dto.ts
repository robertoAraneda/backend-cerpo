import { IsNotEmpty } from 'class-validator';

export class AuthLoginDto {
  @IsNotEmpty()
  rut: string;

  @IsNotEmpty()
  password: string;
}
