import { CreateUserDto } from '../dto/create-user.dto';
import { Role } from '../../auth/role.enum';

const CreateUserStub = (dv): CreateUserDto => {
  return {
    given: 'Claudia',
    fatherFamily: 'Alarcón',
    motherFamily: 'Lazo',
    rut: `11111111-${dv}`,
    email: `c.alarconlazo${dv}@gmail.com`,
    role: Role.ADMIN,
    password: 'admin',
  };
};

export default CreateUserStub;
