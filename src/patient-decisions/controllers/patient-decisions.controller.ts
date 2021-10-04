import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Logger,
  UsePipes,
  ValidationPipe,
  Query,
} from '@nestjs/common';
import { PatientDecisionsService } from '../services/patient-decisions.service';
import { CreatePatientDecisionDto } from '../dto/create-patient-decision.dto';
import { UpdatePatientDecisionDto } from '../dto/update-patient-decision.dto';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../auth/role.enum';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PatientDecision } from '../entities/patient-decision.entity';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { UserAuthInterface } from '../../auth/interfaces/user-auth.interface';
import { GetPatientDecisionsFilterDto } from '../dto/get-patient-decisions-filter.dto';

@Controller({ version: '1', path: 'patient-decisions' })
@Roles(Role.ADMIN)
@UseGuards(JwtAuthGuard)
export class PatientDecisionsController {
  private logger = new Logger('PatientDecisionsController');
  constructor(
    private readonly patientDecisionsService: PatientDecisionsService,
  ) {}

  @Post()
  @UsePipes(ValidationPipe)
  createPatientDecision(
    @Body() createPatientDecisionDto: CreatePatientDecisionDto,
  ): Promise<PatientDecision> {
    return this.patientDecisionsService.createPatientDecision(
      createPatientDecisionDto,
    );
  }

  @Get()
  getPatientDecisions(
    @GetUser() user: UserAuthInterface,
    @Query() filterDto: GetPatientDecisionsFilterDto,
  ): Promise<PatientDecision[]> {
    this.logger.verbose(`User "${user.given}" retrieving all patientDecisions`);
    return this.patientDecisionsService.getPatientDecisions(filterDto);
  }

  @Get(':id')
  getPatientDecisionById(@Param('id') id: number): Promise<PatientDecision> {
    return this.patientDecisionsService.getPatientDecisionById(+id);
  }

  @Patch(':id')
  @UsePipes(ValidationPipe)
  updatePatientDecision(
    @Param('id') id: number,
    @Body() updatePatientDecisionDto: UpdatePatientDecisionDto,
  ): Promise<PatientDecision> {
    return this.patientDecisionsService.updatePatientDecision(
      id,
      updatePatientDecisionDto,
    );
  }

  @Delete(':id')
  removePatientDecision(@Param('id') id: number): Promise<void> {
    return this.patientDecisionsService.removePatientDecision(+id);
  }
}
