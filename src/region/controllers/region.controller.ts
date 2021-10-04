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
} from '@nestjs/common';
import { RegionService } from '../services/region.service';
import { CreateRegionDto } from '../dto/create-region.dto';
import { UpdateRegionDto } from '../dto/update-region.dto';
import { Roles } from '../../auth/decorators/roles.decorator';
import { Role } from '../../auth/role.enum';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { UserAuthInterface } from '../../auth/interfaces/user-auth.interface';
import { GetRegionsFilterDto } from '../dto/get-regions-filter.dto';
import { Region } from '../entities/region.entity';

@Controller({ version: '1', path: 'regions' })
@Roles(Role.ADMIN)
@UseGuards(JwtAuthGuard)
export class RegionController {
  private logger = new Logger('RegionController');
  constructor(private readonly regionsService: RegionService) {}

  @Post()
  @UsePipes(ValidationPipe)
  createRegion(@Body() createRegionDto: CreateRegionDto): Promise<Region> {
    return this.regionsService.createRegion(createRegionDto);
  }

  @Get()
  getRegions(
    @GetUser() user: UserAuthInterface,
    @Query() filterDto: GetRegionsFilterDto,
  ): Promise<Region[]> {
    this.logger.verbose(`User "${user.given}" retrieving all regions`);
    return this.regionsService.getRegions(filterDto);
  }

  @Get(':id')
  getRegionById(@Param('id') id: number): Promise<Region> {
    return this.regionsService.getRegionById(+id);
  }

  @Patch(':id')
  @UsePipes(ValidationPipe)
  updateRegion(
    @Param('id') id: number,
    @Body() updateRegionDto: UpdateRegionDto,
  ): Promise<Region> {
    return this.regionsService.updateRegion(+id, updateRegionDto);
  }

  @Delete(':id')
  removeRegion(@Param('id') id: number): Promise<void> {
    return this.regionsService.removeRegion(+id);
  }
}
