import type { Opt } from '@mikro-orm/core';
import { PrimaryKey, Property } from '@mikro-orm/core';
import { generateUuid } from '@/utils/uuid';

export abstract class BaseEntity {
  @PrimaryKey({ type: 'uuid' })
  id = generateUuid();

  @Property()
  createdAt: Opt<Date> = new Date();

  @Property({ onUpdate: () => new Date() })
  updatedAt: Opt<Date> = new Date();
}
