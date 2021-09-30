import { Module } from '@nestjs/common';
import { PatientsService } from './services/patients.service';
import { PatientsController } from './controllers/patients.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientRepository } from './repositories/patient.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PatientRepository])],
  controllers: [PatientsController],
  providers: [PatientsService],
  exports: [PatientsService],
})
export class PatientsModule {}
