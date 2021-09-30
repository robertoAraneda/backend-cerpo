import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreatePatientDto } from '../dto/create-patient.dto';
import { UpdatePatientDto } from '../dto/update-patient.dto';
import { PatientRepository } from '../repositories/patient.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { GetPatientsFilterDto } from '../dto/get-patients-filter.dto';
import { Patient } from '../entities/patient.entity';

@Injectable()
export class PatientsService {
  constructor(
    @InjectRepository(PatientRepository)
    private readonly patientRepository: PatientRepository,
  ) {}

  async createPatient(createPatientDto: CreatePatientDto): Promise<Patient> {
    return await this.patientRepository.createPatient(createPatientDto);
  }

  async getPatients(filterDto: GetPatientsFilterDto): Promise<Patient[]> {
    return await this.patientRepository.getPatients(filterDto);
  }

  async getPatientById(id: string) {
    const found = await this.patientRepository.findOne(id);

    if (!found) {
      throw new NotFoundException(`Patient with ID "${id}" not found`);
    }
    return found;
  }

  async updatePatient(id: string, updatePatientDto: UpdatePatientDto) {
    return await this.patientRepository.updatePatient(id, updatePatientDto);
  }

  async removePatient(id: string): Promise<void> {
    try {
      const patient = await this.getPatientById(id);
      await this.patientRepository.softRemove<Patient>(patient);
    } catch (e) {
      throw new InternalServerErrorException(e);
    }
  }
}
