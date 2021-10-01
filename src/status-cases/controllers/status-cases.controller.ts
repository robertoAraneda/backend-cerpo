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
import { StatusCasesService } from '../services/status-cases.service';
import { CreateStatusCaseDto } from '../dto/create-status-case.dto';
import { UpdateStatusCaseDto } from '../dto/update-status-case.dto';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../auth/role.enum';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { StatusCase } from '../entities/status-case.entity';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { UserAuthInterface } from '../../auth/interfaces/user-auth.interface';
import { GetStatusCasesFilterDto } from '../dto/get-status-cases-filter.dto';

@Controller({ version: '1', path: 'status-cases' })
@Roles(Role.ADMIN)
@UseGuards(JwtAuthGuard)
export class StatusCasesController {
  private logger = new Logger('StatusCasesController');
  constructor(private readonly statusCasesService: StatusCasesService) {}

  @Post()
  @UsePipes(ValidationPipe)
  createStatusCase(
    @Body() createStatusCaseDto: CreateStatusCaseDto,
  ): Promise<StatusCase> {
    return this.statusCasesService.createStatusCase(createStatusCaseDto);
  }

  @Get()
  getStatusCases(
    @GetUser() user: UserAuthInterface,
    @Query() filterDto: GetStatusCasesFilterDto,
  ): Promise<StatusCase[]> {
    this.logger.verbose(`User "${user.given}" retrieving all statusCases`);
    return this.statusCasesService.getStatusCases(filterDto);
  }

  @Get(':id')
  getStatusCaseById(@Param('id') id: string): Promise<StatusCase> {
    return this.statusCasesService.getStatusCaseById(id);
  }

  @Patch(':id')
  @UsePipes(ValidationPipe)
  updateStatusCase(
    @Param('id') id: string,
    @Body() updateStatusCaseDto: UpdateStatusCaseDto,
  ): Promise<StatusCase> {
    return this.statusCasesService.updateStatusCase(id, updateStatusCaseDto);
  }

  @Delete(':id')
  removeStatusCase(@Param('id') id: string): Promise<void> {
    return this.statusCasesService.removeStatusCase(id);
  }
}
