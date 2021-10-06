import { CreateCommuneDto } from '../dto/create-commune.dto';

const CreateCommuneStub = (region, code): CreateCommuneDto => {
  return {
    name: `name commune ${code}`,
    code: `code ${code}`,
    region,
  };
};

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min)) + min;
}

export default CreateCommuneStub;
