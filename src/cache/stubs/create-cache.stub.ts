import { CreateCacheDto } from '../dto/create-cache.dto';

const CreateCacheStub = (): CreateCacheDto => {
  return {
    type: 'Bearer',
    value: 'cachevalue',
    expiresIn: 3000,
  };
};

export default CreateCacheStub;
