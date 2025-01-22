import { Migration } from '@mikro-orm/migrations';

export class Migration20250122180913_create_posts_and_threads_table extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create index "threads_thread_uuid_index" on "threads" ("thread_uuid");`);

    this.addSql(`create index "posts_post_uuid_index" on "posts" ("post_uuid");`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop index "posts_post_uuid_index";`);

    this.addSql(`drop index "threads_thread_uuid_index";`);
  }

}
