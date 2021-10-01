import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreatePatientDto {
  @IsNotEmpty() @IsString() rut: string;
  @IsNotEmpty() @IsString() given: string;
  @IsNotEmpty() @IsString() fatherFamily: string;
  @IsNotEmpty() @IsString() motherFamily: string;
  @IsNotEmpty() @IsString() mobile: string;
  @IsNotEmpty() @IsString() birthdate: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() address?: string;
  @IsOptional() @IsString() phone?: string;
}
