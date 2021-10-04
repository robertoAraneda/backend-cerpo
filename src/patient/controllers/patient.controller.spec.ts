import { Test, TestingModule } from '@nestjs/testing';
import { PatientController } from './patient.controller';
import { PatientService } from '../services/patient.service';
import { Patient } from '../entities/patient.entity';
import { UserAuthInterface } from '../../auth/interfaces/user-auth.interface';
import { PatientRepository } from '../repositories/patient.repository';
import { CreatePatientDto } from '../dto/create-patient.dto';
import { UpdatePatientDto } from '../dto/update-patient.dto';
import { CreatePatientStub } from '../stubs/create-patient.stub';
import { PatientsStub } from '../stubs/patients.stub';

describe('PatientsController', () => {
  let controller: PatientController;
  let service: PatientService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PatientController],
      providers: [PatientService, PatientRepository],
    }).compile();

    controller = module.get<PatientController>(PatientController);
    service = module.get<PatientService>(PatientService);
  });

  it('should controller be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should service be defined', () => {
    expect(service).toBeDefined();
  });

  describe('GetPatients', () => {
    it('should return and array of Patients', async () => {
      const result: Patient[] = PatientsStub.getAll();

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
      const patient: CreatePatientDto = CreatePatientStub;

      const result: Patient = PatientsStub.getOne();

      jest
        .spyOn(service, 'createPatient')
        .mockImplementation(async () => result);

      expect(await controller.createPatient(patient)).toBe(result);
      expect(service.createPatient).toHaveBeenCalled();
    });
  });

  describe('updatePatient', () => {
    it('should update one patient', async () => {
      const result: Patient = PatientsStub.getOne();

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
      const patient: Patient = PatientsStub.getOne();

      const result: void = undefined;

      jest
        .spyOn(service, 'removePatient')
        .mockImplementation(async () => result);

      expect(await controller.removePatient(patient.id));
      expect(service.removePatient).toHaveBeenCalled();
    });
  });
});
