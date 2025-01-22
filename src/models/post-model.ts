import {
  Entity,
  Property,
  ManyToOne,
  Index,
  EntityRepositoryType,
  Unique,
} from "@mikro-orm/core";
import { Thread } from "@/models/thread-model";
import { PostRepository } from "@/repositories/post-repository";
import { BaseEntity } from "@/models/base-entity";

@Entity({ tableName: "posts", repository: () => PostRepository })
export class Post extends BaseEntity{
  [EntityRepositoryType]?: PostRepository;

  @Property()
  @Unique()
  @Index()
  postUuid!: string;

  @ManyToOne(() => Thread)
  thread!: Thread;

  @Property({length: 5000})
  @Index()
  url!: string;

  @Property()
  @Index()
  ordInThread!: number;

  @Property({length: 5000})
  parentUrl?: string;

  @Property()
  @Index()
  author?: string;

  @Property()
  @Index()
  published!: Date;

  @Property({length: 5000})
  @Index()
  title!: string;

  @Property({length: 100000})
  text!: string;

  @Property()
  highlightText!: string;

  @Property()
  highlightTitle!: string;

  @Property()
  highlightThreadTitle!: string;

  @Property()
  language!: string;

  @Property()
  sentiment?: string;

  @Property({ type: "json" })
  categories?: string[];

  @Property({ type: "json" })
  topics?: string[];

  @Property()
  aiAllow!: boolean;

  @Property()
  hasCanonical!: boolean;

  @Property()
  webzReporter!: boolean;

  @Property({ type: "json" })
  externalImages!: string[];

  @Property({ type: "json" })
  externalLinks?: string[];

  @Property({ type: "json" })
  entities!: Record<string, any>;

  @Property({ type: "json" })
  syndication!: Record<string, any>;

  @Property()
  rating?: string;

  @Property()
  crawled!: Date;

  @Property()
  updated!: Date;
}
