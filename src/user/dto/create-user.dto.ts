import { IsEmail, IsNotEmpty } from 'class-validator';
import { Role } from '../../auth/role.enum';

export class CreateUserDto {
  @IsNotEmpty() rut: string;
  @IsNotEmpty() given: string;
  @IsNotEmpty() fatherFamily: string;
  @IsNotEmpty() motherFamily: string;
  @IsEmail() email: string;
  @IsNotEmpty() password: string;
  @IsNotEmpty() role: Role;
}
