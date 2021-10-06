import { Module } from '@nestjs/common';
import { PatientService } from './services/patient.service';
import { PatientController } from './controllers/patient.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientRepository } from './repositories/patient.repository';
import { CaseRepository } from '../case/repositories/case.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PatientRepository, CaseRepository])],
  controllers: [PatientController],
  providers: [PatientService],
  exports: [PatientService],
})
export class PatientModule {}
