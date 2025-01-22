import {
  Entity,
  Property,
  OneToMany,
  Collection,
  EntityRepositoryType,
  Unique,
  Index,
} from "@mikro-orm/core";
import { Post } from "@/models/post-model";
import { BaseEntity } from "@/models/base-entity";
import { ThreadRepository } from "@/repositories/thread-repository";

@Entity({ tableName: "threads", repository: () => ThreadRepository })
export class Thread extends BaseEntity {
  [EntityRepositoryType]?: ThreadRepository;

  @Property()
  @Unique()
  @Index()
  threadUuid!: string;

  @Property({length: 5000})
  url!: string;

  @Property()
  siteFull!: string;

  @Property()
  site!: string;

  @Property({length: 5000})
  siteSection!: string;

  @Property({ type: "json" })
  siteCategories!: string[];

  @Property({length: 1000})
  sectionTitle?: string;

  @Property({length: 5000})
  title!: string;

  @Property({length: 5000})
  titleFull!: string;

  @Property()
  published!: Date;

  @Property()
  repliesCount!: number;

  @Property()
  participantsCount!: number;

  @Property()
  siteType!: string;

  @Property()
  country?: string;

  @Property({length: 5000})
  mainImage!: string;

  @Property()
  performanceScore!: number;

  @Property({ type: "json" })
  social!: Record<string, any>;

  @Property()
  domainRank?: number;

  @Property()
  domainRankUpdated?: Date;

  @OneToMany(() => Post, (post) => post.thread)
  posts = new Collection<Post>(this);
}
