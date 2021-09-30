import { EntityRepository, Repository } from 'typeorm';
import { Patient } from '../entities/patient.entity';
import { ConflictException } from '@nestjs/common';
import { CreatePatientDto } from '../dto/create-patient.dto';
import { UpdatePatientDto } from '../dto/update-patient.dto';
import { GetPatientsFilterDto } from '../dto/get-patients-filter.dto';

@EntityRepository(Patient)
export class PatientRepository extends Repository<Patient> {
  async getPatients(filterDto: GetPatientsFilterDto): Promise<Patient[]> {
    const { rut, given, fatherFamily, motherFamily } = filterDto;

    const query = this.createQueryBuilder('patient');

    if (rut) {
      query.andWhere('patient.rut ILIKE :rut', { rut: `%${rut}%` });
    }

    if (given) {
      query.andWhere('patient.given ILIKE :given', { given: `%${given}%` });
    }

    if (fatherFamily) {
      query.andWhere('patient.father_family ILIKE :fatherFamily', {
        fatherFamily: `%${fatherFamily}%`,
      });
    }

    if (motherFamily) {
      query.andWhere('patient.mother_family ILIKE :motherFamily', {
        motherFamily: `%${motherFamily}%`,
      });
    }

    return await query.getMany();
  }

  async createPatient(createPatientDto: CreatePatientDto): Promise<Patient> {
    const patient = new Patient(createPatientDto);

    try {
      return await this.save(patient);
    } catch (exception) {
      this.validateUniqueConstraint(exception, createPatientDto);
    }
  }

  async updatePatient(
    uuid: string,
    updatePatientDto: UpdatePatientDto,
  ): Promise<Patient> {
    const patient = await this.findOne(uuid);

    this.merge(patient, updatePatientDto);

    try {
      return await this.save(patient);
    } catch (exception) {
      this.validateUniqueConstraint(exception, updatePatientDto);
    }
  }

  validateUniqueConstraint(exception, dto): any {
    if (/(email)[\s\S]+(already exists)/.test(exception.detail)) {
      throw new ConflictException(
        `Patient with this email "${dto.email}" already exists.`,
      );
    }
    if (/(rut)[\s\S]+(already exists)/.test(exception.detail)) {
      throw new ConflictException(
        `Patient with this rut "${dto.rut}" already exists.`,
      );
    }
    return exception;
  }
}
