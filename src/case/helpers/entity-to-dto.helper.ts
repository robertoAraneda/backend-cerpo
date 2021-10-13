import { classToPlain, plainToClass } from 'class-transformer';

const EntityToDtoHelper = (itemDTO, entity) => {
  return plainToClass(itemDTO, classToPlain(entity), {
    excludeExtraneousValues: true,
  });
};

export default EntityToDtoHelper;
