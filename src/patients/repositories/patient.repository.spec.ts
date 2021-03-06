import { Test, TestingModule } from '@nestjs/testing';
import { PatientRepository } from './patient.repository';
import { Patient } from '../entities/patient.entity';
import { createPatientsArray } from '../stubs/patients.stub';
import { createMemDB } from '../../config/create-memory-database';
import { Connection } from 'typeorm';
import { CreatePatientDto } from '../dto/create-patient.dto';
import { UpdatePatientDto } from '../dto/update-patient.dto';
import { GetPatientsFilterDto } from '../dto/get-patients-filter.dto';
import { ConflictException } from '@nestjs/common';

describe('PatientsRepository', () => {
  let repository: PatientRepository;
  let db: Connection;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [],
    }).compile();
    db = await createMemDB([Patient]);
    repository = db.getCustomRepository<PatientRepository>(PatientRepository);
  });

  afterEach(() => db.close());

  it('should repository be defined', () => {
    expect(repository).toBeDefined();
  });

  describe('getPatients', () => {
    beforeEach(async () => {
      await Promise.all(
        createPatientsArray.map(async (patient) => {
          await repository.createPatient(patient);
        }),
      );
    });

    it('should return and array of Patients', async () => {
      jest.spyOn(repository, 'getPatients');

      const filterDto = {};

      const patients = await repository.find();

      expect(await repository.getPatients(filterDto)).toStrictEqual(patients);

      expect(patients.length).toBe(createPatientsArray.length);
    });

    it('should return and array of filtered Patients', async () => {
      jest.spyOn(repository, 'getPatients');

      const patients = await repository.find();

      const filterDto: GetPatientsFilterDto = {
        given: 'ROBERTO',
        rut: '15654738-7',
        email: 'robaraneda@gmail.com',
        motherFamily: 'Espinoza',
        fatherFamily: 'Araneda',
      };

      expect(await repository.getPatients(filterDto)).toStrictEqual(
        [...patients].filter((patient) =>
          patient.given.includes(filterDto.given),
        ),
      );

      expect(patients.length).toBe(createPatientsArray.length);
    });
  });

  describe('createPatient', () => {
    it('should create one patient', async () => {
      jest.spyOn(repository, 'createPatient');

      const createPatientDto: CreatePatientDto = {
        rut: '15654738-7',
        given: 'ROBERTO ALEJANDRO',
        fatherFamily: 'ARANEDA',
        motherFamily: 'ESPINOZA',
        birthdate: '1983-12-06',
        address: 'AMUNATEGUI 890',
        phone: '45-3453456',
        mobile: '+56958639620',
        email: 'robaraneda@gmail.com',
      };

      const patient: Patient = await repository.createPatient(createPatientDto);

      expect(repository.createPatient).toBeCalledTimes(1);
      expect(patient.constructor.name).toBe('Patient');
      expect(await repository.count()).toBe(1);
    });

    it('should throw an error if patient will be created with an existing rut or email', async () => {
      jest.spyOn(repository, 'createPatient');

      const createPatientDto: CreatePatientDto = {
        rut: '15654738-7',
        given: 'ROBERTO ALEJANDRO',
        fatherFamily: 'ARANEDA',
        motherFamily: 'ESPINOZA',
        birthdate: '1983-12-06',
        address: 'AMUNATEGUI 890',
        phone: '45-3453456',
        mobile: '+56958639620',
        email: 'robaraneda@gmail.com',
      };

      await repository.createPatient(createPatientDto);

      jest.spyOn(repository, 'validateUniqueConstraint');

      try {
        await repository.createPatient(createPatientDto);
      } catch (e) {
        expect(e).toBeInstanceOf(ConflictException);
      }
      expect(repository.validateUniqueConstraint).toHaveBeenCalled();
    });
  });

  describe('updatePatient', () => {
    it('should updated one patient', async () => {
      jest.spyOn(repository, 'updatePatient');

      const createPatientDto: CreatePatientDto = {
        rut: '15654738-7',
        given: 'ROBERTO ALEJANDRO',
        fatherFamily: 'ARANEDA',
        motherFamily: 'ESPINOZA',
        birthdate: '1983-12-06',
        address: 'AMUNATEGUI 890',
        phone: '45-3453456',
        mobile: '+56958639620',
        email: 'robaraneda@gmail.com',
      };

      const patient: Patient = await repository.createPatient(createPatientDto);

      const updatePatientDto: UpdatePatientDto = {
        email: 'roberto.araneda@minsal.cl',
      };

      const updatedPatient: Patient = await repository.updatePatient(
        patient.id,
        updatePatientDto,
      );

      expect(repository.updatePatient).toBeCalledTimes(1);
      expect(updatedPatient.constructor.name).toBe('Patient');
      expect(updatedPatient.email).toBe(updatePatientDto.email);
    });

    it('should thown an ConflictException if one patient used ann existing rut when is updating', async () => {
      jest.spyOn(repository, 'updatePatient');

      const createPatientDto: CreatePatientDto = {
        rut: '15654738-7',
        given: 'ROBERTO ALEJANDRO',
        fatherFamily: 'ARANEDA',
        motherFamily: 'ESPINOZA',
        birthdate: '1983-12-06',
        address: 'AMUNATEGUI 890',
        phone: '45-3453456',
        mobile: '+56958639620',
        email: 'robaraneda@gmail.com',
      };

      const createAnotherPatientDto: CreatePatientDto = {
        rut: '15549763-7',
        given: 'ROBERTO ALEJANDRO',
        fatherFamily: 'ARANEDA',
        motherFamily: 'ESPINOZA',
        birthdate: '1983-12-06',
        address: 'AMUNATEGUI 890',
        phone: '45-3453456',
        mobile: '+56958639620',
        email: 'kuyenko@gmail.com',
      };

      const patient: Patient = await repository.createPatient(createPatientDto);
      await repository.createPatient(createAnotherPatientDto);

      const updatePatientDto: UpdatePatientDto = {
        rut: '15549763-7',
      };

      jest.spyOn(repository, 'validateUniqueConstraint');

      try {
        await repository.updatePatient(patient.id, updatePatientDto);
      } catch (e) {
        expect(e).toBeInstanceOf(ConflictException);
      }
      expect(repository.validateUniqueConstraint).toHaveBeenCalled();
    });

    it('should thown an ConflictException if one patient used ann existing email when is updating', async () => {
      jest.spyOn(repository, 'updatePatient');

      const createPatientDto: CreatePatientDto = {
        rut: '15654738-7',
        given: 'ROBERTO ALEJANDRO',
        fatherFamily: 'ARANEDA',
        motherFamily: 'ESPINOZA',
        birthdate: '1983-12-06',
        address: 'AMUNATEGUI 890',
        phone: '45-3453456',
        mobile: '+56958639620',
        email: 'robaraneda@gmail.com',
      };

      const createAnotherPatientDto: CreatePatientDto = {
        rut: '15549763-7',
        given: 'ROBERTO ALEJANDRO',
        fatherFamily: 'ARANEDA',
        motherFamily: 'ESPINOZA',
        birthdate: '1983-12-06',
        address: 'AMUNATEGUI 890',
        phone: '45-3453456',
        mobile: '+56958639620',
        email: 'kuyenko@gmail.com',
      };

      const patient: Patient = await repository.createPatient(createPatientDto);
      await repository.createPatient(createAnotherPatientDto);

      const updatePatientDto: UpdatePatientDto = {
        email: 'kuyenko@gmail.com',
      };

      jest.spyOn(repository, 'validateUniqueConstraint');

      try {
        await repository.updatePatient(patient.id, updatePatientDto);
      } catch (e) {
        expect(e).toBeInstanceOf(ConflictException);
      }
      expect(repository.validateUniqueConstraint).toHaveBeenCalled();
    });
  });

  describe('deletePatient', () => {
    it('should delete one patient', async () => {
      jest.spyOn(repository, 'softRemove');

      const createPatientDto: CreatePatientDto = {
        rut: '15654738-7',
        given: 'ROBERTO ALEJANDRO',
        fatherFamily: 'ARANEDA',
        motherFamily: 'ESPINOZA',
        birthdate: '1983-12-06',
        address: 'AMUNATEGUI 890',
        phone: '45-3453456',
        mobile: '+56958639620',
        email: 'robaraneda@gmail.com',
      };

      const patient: Patient = await repository.createPatient(createPatientDto);

      await repository.softRemove(patient);

      const getDeletedUser: Patient = await repository.findOne({
        where: { id: patient.id },
        withDeleted: true,
      });

      expect(repository.softRemove).toBeCalledTimes(1);
      expect(await repository.count()).toBe(0);
      expect(getDeletedUser.deletedAt).not.toBe(null);
    });
  });
});
