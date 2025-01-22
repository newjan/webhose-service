import { Request, Response } from "express";

import { WebhoseService } from "@/services/webhose-service";
import { getDB } from "@/configs/db";
import logger from "@/logger";
import { PostService } from "@/services/post-service";
import { ThreadService } from "@/services/thread-service";

export const fetchAndStorePostsFromAPI = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const queryString = req.body.query || "(ipod OR ipad) -android"; // Default if not provided
    const db = await getDB();
    const threadService = new ThreadService(db);
    const postService = new PostService(db);

    const webhoseService = new WebhoseService(db, postService, threadService);
    const count = await webhoseService.fetchAndStorePosts(
      { queryString },
      ({ totalStored, remainingPosts }) => {
        // Callback function to provide progress updates
        logger.info(`Total posts stored until now: ${totalStored}`);
        logger.info(`Remaining posts: ${remainingPosts}`);
      }
    );
    res
      .status(200)
      .json({ message: `Successfully retrieved and stored ${count} posts.` });
  } catch (error) {
    logger.error(`Error fetching and storing posts: ${error}`);
    res.status(500).json({ error: error });
  }
};
