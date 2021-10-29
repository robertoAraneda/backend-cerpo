import { CreateCommuneDto } from '../dto/create-commune.dto';

const CreateCommuneStub = (region, code): CreateCommuneDto => {
  return {
    name: `name commune ${code}`,
    code: `code ${code}`,
    region,
  };
};

export default CreateCommuneStub;
