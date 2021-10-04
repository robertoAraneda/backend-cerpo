import { Patient } from '../entities/patient.entity';

const patients: Patient[] = [
  {
    id: 1,
    rut: '16317005-1',
    given: 'CLAUDIA ALEJANDRA',
    fatherFamily: 'ALARCÓN',
    motherFamily: 'LAZO',
    birthdate: '1985-09-12',
    address: 'LOS LINGUES 533',
    phone: '45-3453456',
    mobile: '958639620',
    email: 'c.alarconlazo@gmail.com',
    active: true,
    createdAt: '2021-09-28T12:47:38.958Z',
    updatedAt: '2021-09-28T12:47:38.958Z',
    deletedAt: null,
  },
  {
    id: 2,
    rut: '15654738-7',
    given: 'ROBERTO ALEJANDRO',
    fatherFamily: 'ARANEDA',
    motherFamily: 'ESPINOZA',
    birthdate: '1983-12-06',
    address: 'AMUNATEGUI 890',
    phone: '45-3453456',
    mobile: '+56958639620',
    email: 'robaraneda@gmail.com',
    active: true,
    createdAt: '2021-09-27T22:09:38.497Z',
    updatedAt: '2021-09-28T12:48:11.827Z',
    deletedAt: null,
  },
];

const getOne = (): Patient => patients[0];

const getAll = (): Patient[] => patients;

const length: number = patients.length;

export const PatientsStub = {
  getAll,
  getOne,
  length,
};
