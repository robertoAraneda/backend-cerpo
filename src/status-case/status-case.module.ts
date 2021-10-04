import { Module } from '@nestjs/common';
import { StatusCaseService } from './services/status-case.service';
import { StatusCaseController } from './controllers/status-case.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StatusCaseRepository } from './repositories/status-case.repository';

@Module({
  imports: [TypeOrmModule.forFeature([StatusCaseRepository])],
  controllers: [StatusCaseController],
  providers: [StatusCaseService],
})
export class StatusCaseModule {}
