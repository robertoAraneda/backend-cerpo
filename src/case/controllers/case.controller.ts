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
  Logger,
  UseInterceptors,
} from '@nestjs/common';
import { CaseService } from '../services/case.service';
import { CreateCaseDto } from '../dto/create-case.dto';
import { UpdateCaseDto } from '../dto/update-case.dto';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../auth/role.enum';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { UserAuthInterface } from '../../auth/interfaces/user-auth.interface';
import { GetCasesFilterDto } from '../dto/get-cases-filter.dto';
import { Case } from '../entities/case.entity';
import { CaseTransformInterceptor } from '../interceptors/case-transform.interceptor';

@Controller({ version: '1', path: 'cases' })
@Roles(Role.ADMIN)
@UseGuards(JwtAuthGuard)
export class CaseController {
  private logger = new Logger('CaseController');
  constructor(private readonly casesService: CaseService) {}

  @Post()
  @UsePipes(ValidationPipe)
  createCase(@Body() createCaseDto: CreateCaseDto): Promise<Case> {
    return this.casesService.createCase(createCaseDto);
  }

  @Get()
  @UseInterceptors(CaseTransformInterceptor)
  getCases(
    @GetUser() user: UserAuthInterface,
    @Query() filterDto: GetCasesFilterDto,
  ): Promise<Case[]> {
    this.logger.verbose(`User "${user.given}" retrieving all cases`);
    return this.casesService.getCases(filterDto);
  }

  @Get(':id')
  getCaseById(@Param('id') id: number): Promise<Case> {
    return this.casesService.getCaseById(+id);
  }

  @Patch(':id')
  @UsePipes(ValidationPipe)
  updateCase(
    @Param('id') id: number,
    @Body() updateCaseDto: UpdateCaseDto,
  ): Promise<Case> {
    return this.casesService.updateCase(+id, updateCaseDto);
  }

  @Delete(':id')
  removeCase(@Param('id') id: number): Promise<void> {
    return this.casesService.removeCase(+id);
  }
}
