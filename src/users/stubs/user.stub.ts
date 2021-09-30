import { CreateUserDto } from '../dto/create-user.dto';
import { Role } from '../../auth/role.enum';

export const UserStub: CreateUserDto = {
  given: 'Claudia',
  fatherFamily: 'Alarcón',
  motherFamily: 'Lazo',
  rut: '11111111-1',
  email: 'c.alarconlazo@gmail.com',
  role: Role.ADMIN,
  password: 'admin',
};
