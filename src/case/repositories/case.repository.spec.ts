import { CaseRepository } from './case.repository';
import { Connection } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { createMemDB } from '../../config/create-memory-database';
import { Case } from '../entities/case.entity';
import { GetCasesFilterDto } from '../dto/get-cases-filter.dto';
import { UpdateCaseDto } from '../dto/update-case.dto';
import CreateCaseStub from '../stubs/create-case.stub';
import { Patient } from '../../patient/entities/patient.entity';
import { System } from '../../system/entities/system.entity';
import { Organization } from '../../organization/entities/organization.entity';
import { User } from '../../user/entities/user.entity';
import { DeliveryRoute } from '../../delivery-route/entities/delivery-route.entity';
import { CommitteeResult } from '../../committee-result/entities/committee-result.entity';
import { StatusCase } from '../../status-case/entities/status-case.entity';
import { CreateCaseDto } from '../dto/create-case.dto';
import { PatientRepository } from '../../patient/repositories/patient.repository';
import { SystemRepository } from '../../system/repositories/system.repository';
import { OrganizationRepository } from '../../organization/repositories/organization.repository';
import { UserRepository } from '../../user/repositories/user.repository';
import { DeliveryRouteRepository } from '../../delivery-route/repositories/delivery-route.repository';
import { CommitteeResultRepository } from '../../committee-result/repositories/committee-result.repository';
import { StatusCaseRepository } from '../../status-case/repositories/status-case.repository';
import { CreateSystemStub } from '../../system/stubs/create-system.stub';
import { CreateOrganizationStub } from '../../organization/stubs/create-organization.stub';
import CreateUserStub from '../../user/stubs/create-user.stub';
import { CreateDeliveryRouteStub } from '../../delivery-route/stubs/create-delivery-route.stub';
import { CreateCommitteeResultStub } from '../../committee-result/stubs/create-committee-result.stub';
import { CreateStatusCaseStub } from '../../status-case/stubs/create-status-case.stub';
import { CreatePatientStub } from '../../patient/stubs/create-patient.stub';

describe('CasesRepository', () => {
  let repository: CaseRepository;
  let patientRepository: PatientRepository;
  let systemRepository: SystemRepository;
  let organizationRepository: OrganizationRepository;
  let userRepository: UserRepository;
  let deliveryRouteRepository: DeliveryRouteRepository;
  let committeeResultRepository: CommitteeResultRepository;
  let statusCaseRepository: StatusCaseRepository;
  let db: Connection;
  let cases: Case[];
  let createCaseDto: CreateCaseDto;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [],
    }).compile();
    db = await createMemDB();

    repository = db.getCustomRepository<CaseRepository>(CaseRepository);
    patientRepository =
      db.getCustomRepository<PatientRepository>(PatientRepository);
    systemRepository =
      db.getCustomRepository<SystemRepository>(SystemRepository);
    organizationRepository = db.getCustomRepository<OrganizationRepository>(
      OrganizationRepository,
    );
    userRepository = db.getCustomRepository<UserRepository>(UserRepository);
    deliveryRouteRepository = db.getCustomRepository<DeliveryRouteRepository>(
      DeliveryRouteRepository,
    );
    committeeResultRepository =
      db.getCustomRepository<CommitteeResultRepository>(
        CommitteeResultRepository,
      );
    statusCaseRepository =
      db.getCustomRepository<StatusCaseRepository>(StatusCaseRepository);

    const patient: Patient = await patientRepository.createPatient(
      CreatePatientStub,
    );
    const system: System = await systemRepository.createSystem(
      CreateSystemStub,
    );
    const organization: Organization =
      await organizationRepository.createOrganization(CreateOrganizationStub);

    const practitioner: User = await userRepository.createUser(
      CreateUserStub('K'),
    );
    const deliveryRoute: DeliveryRoute =
      await deliveryRouteRepository.createDeliveryRoute(
        CreateDeliveryRouteStub,
      );
    const committeeResult: CommitteeResult =
      await committeeResultRepository.createCommitteeResult(
        CreateCommitteeResultStub,
      );

    const statusCase: StatusCase = await statusCaseRepository.createStatusCase(
      CreateStatusCaseStub,
    );

    const round = 3;

    //se cra un caso para ser rutilizado
    createCaseDto = CreateCaseStub(
      patient,
      committeeResult,
      deliveryRoute,
      organization,
      practitioner,
      statusCase,
      system,
    );

    for (let i = 0; i < round; i++) {
      await repository.createCase(createCaseDto);
    }
    cases = await repository.find();
  });

  afterEach(() => db.close());

  it('should repository be defined', () => {
    expect(repository).toBeDefined();
  });

  it('should return and array of Cases', async () => {
    jest.spyOn(repository, 'getCases');

    const filterDto = {};
    const casesFilteredDto = await repository.getCases(filterDto);

    expect(casesFilteredDto).toHaveLength(cases.length);
    expect(cases.length).toBe(casesFilteredDto.length);
  });

  it('should return and array of filtered Cases', async () => {
    jest.spyOn(repository, 'getCases');

    const filterDto: GetCasesFilterDto = {
      title: 'title',
    };

    const casesFilteredDto = await repository.getCases(filterDto);

    expect(casesFilteredDto).toHaveLength(
      [...cases].filter((caseEntity) =>
        caseEntity.title.includes(filterDto.title),
      ).length,
    );
  });

  it('should create one case', async () => {
    jest.spyOn(repository, 'createCase');

    const caseEntity: Case = await repository.createCase(createCaseDto);

    expect(repository.createCase).toBeCalledTimes(1);
    expect(caseEntity.constructor.name).toBe('Case');
    expect(await repository.count()).toBe(cases.length + 1);
  });

  it('should updated one case', async () => {
    jest.spyOn(repository, 'updateCase');

    const caseEntity: Case = await repository.createCase(createCaseDto);

    const updateCaseDto: UpdateCaseDto = {
      title: 'new title Case',
    };

    const updatedCase: Case = await repository.updateCase(
      caseEntity.id,
      updateCaseDto,
    );

    expect(repository.updateCase).toBeCalledTimes(1);
    expect(updatedCase.constructor.name).toBe('Case');
    expect(updatedCase.title).toBe(updateCaseDto.title);
  });

  it('should delete one case', async () => {
    jest.spyOn(repository, 'softRemove');

    const caseEntity: Case = await repository.createCase(createCaseDto);
    await repository.softRemove(caseEntity);

    const getDeletedUser: Case = await repository.findOne({
      where: { id: caseEntity.id },
      withDeleted: true,
    });

    expect(repository.softRemove).toBeCalledTimes(1);
    expect(await repository.count()).toBe(cases.length);
    expect(getDeletedUser.deletedAt).not.toBe(null);
  });
});
