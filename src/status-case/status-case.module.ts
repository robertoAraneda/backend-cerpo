import { Module } from '@nestjs/common';
import { StatusCaseService } from './services/status-case.service';
import { StatusCaseController } from './controllers/status-case.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatusCaseRepository } from './repositories/status-case.repository';
import { CaseRepository } from '../case/repositories/case.repository';

@Module({
  imports: [TypeOrmModule.forFeature([StatusCaseRepository, CaseRepository])],
  controllers: [StatusCaseController],
  providers: [StatusCaseService],
})
export class StatusCaseModule {}
