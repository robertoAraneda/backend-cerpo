import { Module } from '@nestjs/common';
import { PatientDecisionsService } from './services/patient-decisions.service';
import { PatientDecisionsController } from './controllers/patient-decisions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientDecisionsRepository } from './repositories/patient-decisions.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PatientDecisionsRepository])],
  controllers: [PatientDecisionsController],
  providers: [PatientDecisionsService],
})
export class PatientDecisionsModule {}
