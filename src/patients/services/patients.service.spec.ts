import { Test, TestingModule } from '@nestjs/testing';
import { PatientsService } from './patients.service';
import { PatientRepository } from '../repositories/patient.repository';
import { Patient } from '../entities/patient.entity';
import { patientsStub } from '../stubs/patients.stub';
import { PatientStub } from '../stubs/patient.stub';
import { CreatePatientDto } from '../dto/create-patient.dto';
import { UpdatePatientDto } from '../dto/update-patient.dto';
import { ConflictException, NotFoundException } from '@nestjs/common';

describe('PatientsService', () => {
  let service: PatientsService;
  let repository: PatientRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PatientsService, PatientRepository],
    }).compile();

    service = module.get<PatientsService>(PatientsService);
    repository = module.get<PatientRepository>(PatientRepository);
  });

  it('should service be defined', () => {
    expect(service).toBeDefined();
  });

  it('should repository be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('GetPatients', () => {
    it('should return and array of Patients', async () => {
      const result: Patient[] = patientsStub;

      jest
        .spyOn(repository, 'getPatients')
        .mockImplementation(async () => result);

      const filterDto = {
        given: 'ROBERTO',
      };

      expect(await service.getPatients(filterDto)).toBe(result);
      expect(repository.getPatients).toHaveBeenCalled();
    });
  });

  describe('GetPatient', () => {
    it('should return a patient founded by id', async () => {
      const result: Patient = PatientStub;

      jest.spyOn(repository, 'findOne').mockImplementation(async () => result);

      expect(await service.getPatientById(result.id)).toBe(result);
      expect(repository.findOne).toHaveBeenCalled();
    });

    it("should throw an NotFoundHttpException if patient doesn't exist", async () => {
      const result: Patient = PatientStub;

      jest
        .spyOn(repository, 'findOne')
        .mockImplementation(async () => undefined);

      try {
        await service.getPatientById(result.id);
      } catch (e) {
        expect(e).toBeInstanceOf(NotFoundException);
      }

      expect(repository.findOne).toHaveBeenCalled();
    });
  });

  describe('CreatePatient', () => {
    it('should create one patient', async () => {
      const createPatientDto: CreatePatientDto = PatientStub;
      const result = patientsStub[0];

      jest
        .spyOn(repository, 'createPatient')
        .mockImplementation(async () => result);

      expect(await service.createPatient(createPatientDto)).toBe(result);
      expect(repository.createPatient).toHaveBeenCalled();
    });
  });

  describe('UpdatePatient', () => {
    it('should update one patient', async () => {
      const patient: Patient = patientsStub[0];

      const updatePatientDto: UpdatePatientDto = {
        email: 'robaraneda@gmail.com',
      };

      jest
        .spyOn(repository, 'updatePatient')
        .mockImplementation(async () => patient);

      expect(await service.updatePatient(patient.id, updatePatientDto)).toBe(
        patient,
      );
      expect(repository.updatePatient).toHaveBeenCalled();
    });
  });

  describe('DeletePatient', () => {
    it('should delete one patient', async () => {
      const patient: Patient = patientsStub[0];

      jest
        .spyOn(repository, 'softRemove')
        .mockImplementation(async () => undefined);

      jest
        .spyOn(service, 'getPatientById')
        .mockImplementation(async () => patient);

      expect(await service.removePatient(patient.id)).toBe(undefined);
      expect(repository.softRemove).toHaveBeenCalledTimes(1);
      expect(service.getPatientById).toHaveBeenCalledTimes(1);
    });
  });
});
