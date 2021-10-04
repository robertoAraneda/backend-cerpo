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
import { CommitteeResultService } from '../services/committee-result.service';
import { CreateCommitteeResultDto } from '../dto/create-committee-result.dto';
import { UpdateCommitteeResultDto } from '../dto/update-committee-result.dto';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../auth/role.enum';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { CommitteeResult } from '../entities/committee-result.entity';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { UserAuthInterface } from '../../auth/interfaces/user-auth.interface';
import { GetCommitteeResultsFilterDto } from '../dto/get-committee-results-filter.dto';

@Controller({ version: '1', path: 'committee-results' })
@Roles(Role.ADMIN)
@UseGuards(JwtAuthGuard)
export class CommitteeResultController {
  private logger = new Logger('CommitteeResultController');
  constructor(
    private readonly committeeResultsService: CommitteeResultService,
  ) {}

  @Post()
  @UsePipes(ValidationPipe)
  createCommitteeResult(
    @Body() createCommitteeResultDto: CreateCommitteeResultDto,
  ): Promise<CommitteeResult> {
    return this.committeeResultsService.createCommitteeResult(
      createCommitteeResultDto,
    );
  }

  @Get()
  getCommitteeResults(
    @GetUser() user: UserAuthInterface,
    @Query() filterDto: GetCommitteeResultsFilterDto,
  ): Promise<CommitteeResult[]> {
    this.logger.verbose(`User "${user.given}" retrieving all committeeResults`);
    return this.committeeResultsService.getCommitteeResults(filterDto);
  }

  @Get(':id')
  getCommitteeResultById(@Param('id') id: number): Promise<CommitteeResult> {
    return this.committeeResultsService.getCommitteeResultById(+id);
  }

  @Patch(':id')
  @UsePipes(ValidationPipe)
  updateCommitteeResult(
    @Param('id') id: number,
    @Body() updateCommitteeResultDto: UpdateCommitteeResultDto,
  ): Promise<CommitteeResult> {
    return this.committeeResultsService.updateCommitteeResult(
      id,
      updateCommitteeResultDto,
    );
  }

  @Delete(':id')
  removeCommitteeResult(@Param('id') id: number): Promise<void> {
    return this.committeeResultsService.removeCommitteeResult(+id);
  }
}
