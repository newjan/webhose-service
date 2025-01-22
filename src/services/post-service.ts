import { Thread } from "@/models/thread-model";
import { Post } from "@/models/post-model";
import { DB, RequiredEntityData } from "@/configs/db";
import { PostApiData } from "@/types/webhose";
import { mapThreadApiObjToModel } from "@/mapper/thread-mapper";
import { mapPostApiObjToModel } from "@/mapper/post-mapper";
import logger from "@/logger";

export class PostService {
  private db: DB;

  constructor(db: DB) {
    this.db = db;
  }

  /**
   * Fetch existing posts by UUIDs.
   * @param postUuids The UUIDs of posts to fetch.
   * @returns An array of existing posts.
   */
  public async fetchExistingPosts(postUuids: string[]): Promise<Post[]> {
    return this.db.postRepository.findByUUIDs(postUuids);
  }

  /**
   * Create a new post.
   * @param post The post to create.
   * @returns The newly created post.
   */
  public createPost(post: RequiredEntityData<Post>): Post {
    return this.db.postRepository.create(post);
  }

  /**
   * Persist new threads and posts into the database.
   * @param newThreads The array of new threads to persist.
   * @param newPosts The array of new posts to persist.
   */
  public async saveThreadsAndPosts(
    newThreads: Thread[],
    newPosts: Post[]
  ): Promise<void> {
    try {
      if (newThreads.length > 0) {
        await this.db.em.persist(newThreads);
        logger.info(`${newThreads.length} new threads saved.`);
      }

      if (newPosts.length > 0) {
        await this.db.em.persist(newPosts);
        logger.info(`${newPosts.length} new posts saved.`);
      }

      await this.db.em.flush();
      logger.info("Database changes flushed successfully.");
    } catch (error) {
      logger.error("Error saving threads and posts:", error);
      throw new Error("Failed to save threads and posts.");
    }
  }
}
