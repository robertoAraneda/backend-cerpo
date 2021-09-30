import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreatePatientDto {
  @IsNotEmpty() @IsString() rut: string;
  @IsNotEmpty() @IsString() given: string;
  @IsNotEmpty() @IsString() fatherFamily: string;
  @IsNotEmpty() @IsString() motherFamily: string;
  @IsNotEmpty() @IsString() mobile: string;
  @IsNotEmpty() @IsString() birthdate: string;
  @IsEmail() @IsNotEmpty() email?: string;
  @IsString() address?: string;
  @IsString() phone?: string;
}
