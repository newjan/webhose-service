import { EntityRepository, Field, FilterQuery, FindOneOptions } from '@mikro-orm/postgresql';
import { BaseEntity } from '@/models/base-entity';
import { NotFoundError } from '@/common/exceptions';

export class BaseRepository<T extends BaseEntity> extends EntityRepository<T> {
    findByIdOrThrow(id: string): Promise<T> {
      return this.em.findOneOrFail(this.entityName, { id } as FilterQuery<T>, {
        failHandler: (entityName) => {
          throw new NotFoundError(`${entityName} with id ${id} not found`);
        },
      });
    }
}