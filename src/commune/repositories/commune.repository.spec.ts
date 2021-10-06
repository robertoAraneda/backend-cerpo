import { CommuneRepository } from './commune.repository';
import { Connection } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { createMemDB } from '../../config/create-memory-database';
import { Commune } from '../entities/commune.entity';
import { GetCommunesFilterDto } from '../dto/get-communes-filter.dto';
import { UpdateCommuneDto } from '../dto/update-commune.dto';
import CreateCommuneStub from '../stubs/create-commune.stub';
import { RegionRepository } from '../../region/repositories/region.repository';
import { CreateRegionStub } from '../../region/stubs/create-region.stub';
import { Region } from '../../region/entities/region.entity';
import { CreateCommuneDto } from '../dto/create-commune.dto';

describe('CommunesRepository', () => {
  let repository: CommuneRepository;
  let regionRepository: RegionRepository;
  let db: Connection;
  let region: Region;
  let communes: Commune[];
  let communeDto: CreateCommuneDto;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [],
    }).compile();
    db = await createMemDB();
    repository = db.getCustomRepository<CommuneRepository>(CommuneRepository);
    regionRepository =
      db.getCustomRepository<RegionRepository>(RegionRepository);

    region = await regionRepository.createRegion(CreateRegionStub);

    for (let i = 0; i < 3; i++) {
      communeDto = CreateCommuneStub(region, i);
      await repository.createCommune(communeDto);
    }

    communes = await repository.find();
  });

  afterEach(() => db.close());

  it('should repository be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should return and array of Communes', async () => {
    jest.spyOn(repository, 'getCommunes');

    const filterDto = {};

    expect(await repository.getCommunes(filterDto)).toHaveLength(
      communes.length,
    );
  });

  it('should return and array of filtered Communes', async () => {
    jest.spyOn(repository, 'getCommunes');

    const filterDto: GetCommunesFilterDto = {
      name: 'commune 1',
    };

    const communesFiltered = await repository.getCommunes(filterDto);

    expect(communesFiltered).toHaveLength(
      [...communes].filter((commune) => commune.name.includes(filterDto.name))
        .length,
    );
  });

  it('should create one commune', async () => {
    jest.spyOn(repository, 'createCommune');

    const commune: Commune = await repository.createCommune(communeDto);

    expect(repository.createCommune).toBeCalledTimes(1);
    expect(commune.constructor.name).toBe('Commune');
    expect(commune.code).toStrictEqual(communeDto.code);
  });

  it('should updated one commune', async () => {
    jest.spyOn(repository, 'updateCommune');
    jest.spyOn(repository, 'findOne');

    const commune: Commune = await repository.createCommune(communeDto);

    const updateCommuneDto: UpdateCommuneDto = {
      name: 'new name Commune',
    };

    const updatedCommune: Commune = await repository.updateCommune(
      commune.code,
      updateCommuneDto,
    );

    expect(repository.findOne).toBeCalledTimes(1);
    expect(repository.findOne).toBeCalledWith(commune.code);
    expect(updatedCommune.constructor.name).toBe('Commune');
    expect(updatedCommune.name).toBe(updateCommuneDto.name);
  });

  it('should delete one commune', async () => {
    jest.spyOn(repository, 'softRemove');

    const commune: Commune = await repository.createCommune(communeDto);

    await repository.softRemove(commune);

    const getDeletedUser: Commune = await repository.findOne({
      where: { code: commune.code },
      withDeleted: true,
    });

    // expect(await repository.count()).toBe(communes.length);
    expect(getDeletedUser.deletedAt).not.toBe(null);
  });
});
