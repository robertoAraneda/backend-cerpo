import { User } from '../entities/user.entity';
import { Role } from '../../auth/role.enum';

const users: User[] = [
  {
    id: '8c26266f-3fe9-4b5b-bd88-bc2754415c12',
    given: 'Roberto',
    fatherFamily: 'Araneda',
    motherFamily: 'Espinoza',
    rut: '15654738-7',
    email: 'robaraneda@gmail.com',
    password: '$2b$10$PwMq.ZNhL8W1zp5f6Cqp2eg/tWknnZPV6yt81L.nr7tC/QrV1KJmW',
    createdAt: '2021-09-20T22:13:55.971Z',
    updatedAt: '2021-09-21T19:00:05.280Z',
    deletedAt: null,
    salt: null,
    role: Role.ADMIN,
  },
  {
    id: '7dc25590-d96f-47dc-a7df-49dfb665ecda',
    given: 'Claudia Andrea',
    fatherFamily: 'Contreras',
    motherFamily: 'Mellado',
    rut: '15549763-7',
    email: 'kuyenko@yahoo.es',
    password: '$2b$10$QL2CZTIIyhlY9E0zs2Uf9eNBlbJWuqf/TzJo1dodDYtbi5bmp4Yp6',
    createdAt: '2021-09-20T20:32:05.479Z',
    updatedAt: '2021-09-21T19:01:21.252Z',
    deletedAt: null,
    salt: null,
    role: Role.USER,
  },
  {
    id: '4b2d2652-43c2-4d35-990f-8f0ced3a46f4',
    given: 'Claudia Alejandra',
    fatherFamily: 'Alarcón',
    motherFamily: 'Lazo',
    rut: '16317005-1',
    email: 'c.alarconlazo@gmail.com',
    password: '$2b$10$QKdt3McPFtWikUdug0tG2uV9pvQAIF00MZ1WMeHudYIse85F260GG',
    createdAt: '2021-09-21T13:50:23.195Z',
    updatedAt: '2021-09-21T19:00:23.480Z',
    deletedAt: null,
    salt: null,
    role: Role.ADMIN,
  },
];

const getOne = (): User => users[0];

const getAll = (): User[] => users;

const length: number = users.length;

export const UsersStub = {
  getAll,
  getOne,
  length,
};
