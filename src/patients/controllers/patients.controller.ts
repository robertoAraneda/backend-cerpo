import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { PatientsService } from '../services/patients.service';
import { CreatePatientDto } from '../dto/create-patient.dto';
import { UpdatePatientDto } from '../dto/update-patient.dto';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../auth/role.enum';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { GetPatientsFilterDto } from '../dto/get-patients-filter.dto';
import { Patient } from '../entities/patient.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { UserAuthInterface } from '../../auth/interfaces/user-auth.interface';

@Controller({ version: '1', path: 'patients' })
@Roles(Role.ADMIN)
@UseGuards(RolesGuard)
@UseGuards(JwtAuthGuard)
export class PatientsController {
  constructor(private readonly patientsService: PatientsService) {}

  @Post()
  @UsePipes(ValidationPipe)
  createPatient(@Body() createPatientDto: CreatePatientDto): Promise<Patient> {
    return this.patientsService.createPatient(createPatientDto);
  }

  @Get()
  getPatients(
    @GetUser() user: UserAuthInterface,
    @Query() filterDto: GetPatientsFilterDto,
  ): Promise<Patient[]> {
    return this.patientsService.getPatients(filterDto);
  }

  @Get(':id')
  getPatientById(@Param('id') id: string) {
    return this.patientsService.getPatientById(id);
  }

  @Patch(':id')
  updatePatient(
    @Param('id') id: string,
    @Body() updatePatientDto: UpdatePatientDto,
  ) {
    return this.patientsService.updatePatient(id, updatePatientDto);
  }

  @Delete(':id')
  removePatient(@Param('id') id: string) {
    return this.patientsService.removePatient(id);
  }
}
