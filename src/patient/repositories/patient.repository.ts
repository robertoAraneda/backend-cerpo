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
    const checkIfRutExist = await this.findOne({ rut: createPatientDto.rut });

    if (checkIfRutExist)
      throw new ConflictException(
        `Patient with this rut "${createPatientDto.rut}" already exists.`,
      );

    const checkIfEmailExist = await this.findOne({
      email: createPatientDto.email,
    });

    if (checkIfEmailExist)
      throw new ConflictException(
        `Patient with this email "${createPatientDto.email}" already exists.`,
      );
    const patient = new Patient(createPatientDto);

    return await this.save(patient);
  }

  async updatePatient(
    id: number,
    updatePatientDto: UpdatePatientDto,
  ): Promise<Patient> {
    const patient = await this.findOne(id);

    const checkIfRutExist = await this.findOne({ rut: updatePatientDto.rut });

    if (checkIfRutExist && checkIfRutExist.id !== id)
      throw new ConflictException(
        `Patient with this rut "${updatePatientDto.rut}" already exists.`,
      );

    const checkIfEmailExist = await this.findOne({
      email: updatePatientDto.email,
    });

    if (checkIfEmailExist && checkIfEmailExist.id !== id)
      throw new ConflictException(
        `Patient with this email "${updatePatientDto.email}" already exists.`,
      );

    this.merge(patient, updatePatientDto);

    return await this.save(patient);
  }
}
