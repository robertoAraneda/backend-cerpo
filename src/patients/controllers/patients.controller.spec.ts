import { Test, TestingModule } from '@nestjs/testing';
import { PatientsController } from './patients.controller';
import { PatientsService } from '../services/patients.service';
import { Patient } from '../entities/patient.entity';
import { UserAuthInterface } from '../../auth/interfaces/user-auth.interface';
import { PatientRepository } from '../repositories/patient.repository';
import { patientsStub } from '../stubs/patients.stub';
import { CreatePatientDto } from '../dto/create-patient.dto';
import { UpdatePatientDto } from '../dto/update-patient.dto';
import { PatientStub } from '../stubs/patient.stub';

describe('PatientsController', () => {
  let controller: PatientsController;
  let service: PatientsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PatientsController],
      providers: [PatientsService, PatientRepository],
    }).compile();

    controller = module.get<PatientsController>(PatientsController);
    service = module.get<PatientsService>(PatientsService);
  });

  it('should controller be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should service be defined', () => {
    expect(service).toBeDefined();
  });

  describe('GetPatients', () => {
    it('should return and array of Patients', async () => {
      const result: Patient[] = patientsStub;

      jest.spyOn(service, 'getPatients').mockImplementation(async () => result);

      const user: UserAuthInterface = {
        id: '15654738-7',
        given: 'ROBERTO ALEJANDRO',
        fatherFamily: 'ARANEDA',
        motherFamily: 'ESPINOZA',
        role: 'admin',
      };
      const filterDto = {};

      expect(await controller.getPatients(user, filterDto)).toBe(result);
      expect(service.getPatients).toHaveBeenCalled();
    });
  });

  describe('CreatePatient', () => {
    it('should create one patient', async () => {
      const patient: CreatePatientDto = {
        rut: '15549763-7',
        given: 'CLAUDIA ANDREA',
        fatherFamily: 'CONTRERAS',
        motherFamily: 'MELLADO',
        email: 'kuyenko@gmail.com',
        address: 'JUAN ENRIQUE RODO 05080',
        birthdate: '1984-06-25',
        phone: '45-3453456',
        mobile: '958639620',
      };

      const result: Patient = PatientStub;

      jest
        .spyOn(service, 'createPatient')
        .mockImplementation(async () => result);

      expect(await controller.createPatient(patient)).toBe(result);
      expect(service.createPatient).toHaveBeenCalled();
    });
  });

  describe('updatePatient', () => {
    it('should update one patient', async () => {
      const result: Patient = PatientStub;

      const updatedata: UpdatePatientDto = {
        given: 'NAME CHANGED',
      };

      jest
        .spyOn(service, 'updatePatient')
        .mockImplementation(async () => result);

      expect(await controller.updatePatient(result.id, updatedata)).toBe(
        result,
      );
      expect(service.updatePatient).toHaveBeenCalled();
    });
  });

  describe('deletePatient', () => {
    it('should delete one patient', async () => {
      const patient: Patient = PatientStub;

      const result: void = undefined;

      jest
        .spyOn(service, 'removePatient')
        .mockImplementation(async () => result);

      expect(await controller.removePatient(patient.id));
      expect(service.removePatient).toHaveBeenCalled();
    });
  });
});
