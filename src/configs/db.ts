import { ISchemaGenerator, MikroORM } from "@mikro-orm/core";
import config from "@/configs/mikro-orm-config";
import { EntityManager } from "@mikro-orm/postgresql";
import { PostRepository } from "@/repositories/post-repository";
import { Post } from "@/models/post-model";
import { ThreadRepository } from "@/repositories/thread-repository";
import { Thread } from "@/models/thread-model";

export interface DB {
  orm: MikroORM;
  em: EntityManager;
  generator: ISchemaGenerator;
  postRepository: PostRepository;
  threadRepository: ThreadRepository;
}

let cache: DB;

export async function getDB(): Promise<DB> {
  if (cache) {
    return cache;
  }

  const orm = await MikroORM.init(config);

  return setAndReturnCacheDB(orm);
}

export async function setAndReturnCacheDB(orm: any): Promise<DB> {
  return (cache = {
    orm,
    em: orm.em,
    generator: orm.getSchemaGenerator(),
    postRepository: orm.em.getRepository(Post),
    threadRepository: orm.em.getRepository(Thread),
  });
}

export type { RequiredEntityData, LockMode } from "@mikro-orm/core";
export { UniqueConstraintViolationException } from "@mikro-orm/core";
