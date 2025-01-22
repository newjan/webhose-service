import axios from "axios";
import _ from "lodash";
import { Thread } from "@/models/thread-model";
import { Post } from "@/models/post-model";
import { DB } from "@/configs/db";
import { PostApiData, ThreadApiData } from "@/types/webhose";
import logger from "@/logger";
import { mapThreadApiObjToModel } from "@/mapper/thread-mapper";
import { mapPostApiObjToModel } from "@/mapper/post-mapper";
import { PostService } from "./post-service";
import { ThreadService } from "./thread-service";
import Bottleneck from "bottleneck";

/**
 * Service for interacting with the Webhose API and processing posts and threads.
 */
export class WebhoseService {
  private static readonly EXTERNAL_API_BASE_URL = "http://api.webz.io";
  private db: DB;
  private postService: PostService;
  private threadService: ThreadService;

  private limiter: Bottleneck;

  constructor(
    db: DB,
    postService: PostService,
    threadService: ThreadService,
    limiter?: Bottleneck
  ) {
    this.db = db;
    this.postService = postService;
    this.threadService = threadService;
    this.limiter =
      limiter ||
      new Bottleneck({
        maxConcurrent: 1, // Limit to 1 request at a time
        minTime: 1000, // At least 1 second between requests
      });
  }

  /**
   * Fetches posts from the external API and stores them in the database.
   * @param query The query string for the API.
   * @param callback A function to invoke with progress updates.
   * @returns The total number of posts stored.
   */
  public async fetchAndStorePosts(
    options: Record<string, any>,
    callback?: (progress: {
      totalStored: number;
      remainingPosts: number;
    }) => void
  ): Promise<number> {
    let totalStored = 0;
    let nextUrl = "";

    while (true) {
      const { posts, moreResultsAvailable, next } = await this.limiter.schedule(
        () => this.fetchPosts(options.queryString, nextUrl)
      );

      logger.info(`Fetched posts from API: ${posts.length}`);

      await this.storePostsAndThreads(posts);

      totalStored += posts.length;

      if (callback) {
        callback({ totalStored, remainingPosts: moreResultsAvailable });
      }

      if (!moreResultsAvailable) break;

      nextUrl = next;
    }

    logger.info("All posts have been stored.");
    return totalStored;
  }

  /**
   * Fetch posts from the external API.
   * @param query The query string for the API.
   * @param nextUrl The next page URL if available.
   * @returns The API response containing posts and pagination details.
   */
  private async fetchPosts(
    query: string,
    nextUrl: string
  ): Promise<{
    posts: PostApiData[];
    moreResultsAvailable: number;
    next: string;
  }> {
    const url = nextUrl
      ? `${WebhoseService.EXTERNAL_API_BASE_URL}${nextUrl}`
      : `${WebhoseService.EXTERNAL_API_BASE_URL}/filterWebContent`;

    try {
      const params = nextUrl
        ? {}
        : {
            token: process.env.WEBZIO_API_KEY,
            q: query,
          };
      logger.info(`Fetching posts from URL: ${url}`);

      const response = await axios.get(url, { params });

      const { moreResultsAvailable, next, posts } = response.data;

      logger.info(`${moreResultsAvailable} more results available`);
      logger.info(`${next} is the next page URL`);

      return { posts, moreResultsAvailable, next };
    } catch (error) {
      logger.error(`Error fetching posts from API: ${error}`);
      throw new Error("Failed to fetch posts from API");
    }
  }

  /**
   * Store posts and their threads in the database.
   * @param posts The array of posts to store.
   */
  private async storePostsAndThreads(posts: PostApiData[]): Promise<void> {
    try {
      const { existingThreads, existingPosts } = await this.fetchExistingData(
        posts
      );
      const { newThreads, newPosts } = this.processPostsAndThreads(
        posts,
        existingThreads,
        existingPosts
      );

      await this.postService.saveThreadsAndPosts(newThreads, newPosts);
    } catch (error) {
      logger.error(`Error storing posts and threads: ${error}`);
      throw new Error("Failed to store posts and threads");
    }
  }

  /**
   * Fetch existing threads and posts from the database.
   * @param posts The array of posts to store.
   * @returns An object containing existing threads and posts.
   */
  private async fetchExistingData(
    posts: PostApiData[]
  ): Promise<{ existingThreads: Thread[]; existingPosts: Post[] }> {
    const threadUuids = _.uniq(posts.map((post) => post.thread.uuid));
    const postUuids = _.uniq(posts.map((post) => post.uuid));

    logger.info("Fetching existing threads and posts from the database.");

    const [existingThreads, existingPosts] = await Promise.all([
      this.db.threadRepository.findByUUIDs(threadUuids),
      this.db.postRepository.findByUUIDs(postUuids),
    ]);

    return { existingThreads, existingPosts };
  }

  /**
   * Process posts and threads into new entities.
   * @param posts The array of posts to store.
   * @param existingThreads The existing threads from the database.
   * @param existingPosts The existing posts from the database.
   * @returns An object containing new threads and posts.
   */
  private processPostsAndThreads(
    posts: PostApiData[],
    existingThreads: Thread[],
    existingPosts: Post[]
  ): { newThreads: Thread[]; newPosts: Post[] } {
    const existingPostUuids = new Set(
      existingPosts.map((post) => post.postUuid)
    );

    const newThreads: Thread[] = [];
    const newPosts: Post[] = [];
    const threadMap = new Map<string, Thread>();

    for (const post of posts) {
      const threadUuid = post.thread.uuid;

      if (!threadMap.has(threadUuid)) {
        let threadEntity = existingThreads.find(
          (thread) => thread.threadUuid === threadUuid
        );

        if (!threadEntity) {
          const threadModel = mapThreadApiObjToModel(post.thread);
          threadEntity = this.threadService.createThread(threadModel);
          newThreads.push(threadEntity);
        }

        threadMap.set(threadUuid, threadEntity);
      }

      if (!existingPostUuids.has(post.uuid)) {
        const postModel = mapPostApiObjToModel(
          post,
          threadMap.get(threadUuid)!
        );
        newPosts.push(this.postService.createPost(postModel));
      }
    }

    return { newThreads, newPosts };
  }
}
