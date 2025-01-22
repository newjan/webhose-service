import axios from "axios";
import Bottleneck from "bottleneck";
import { WebhoseService } from "@/services/webhose-service";
import { PostService } from "@/services/post-service";
import { ThreadService } from "@/services/thread-service";
import { DB } from "@/configs/db";
import { PostApiData } from "@/types/webhose";
import { Thread } from "@/models/thread-model";
import { Post } from "@/models/post-model";
import { createMockPostApiData } from "@/tests/fixtures/webhose.fixtures";

jest.mock("axios");
jest.mock("@/services/post-service");
jest.mock("@/services/thread-service");

describe("WebhoseService", () => {
  let webhoseService: WebhoseService;
  let mockDB: DB;
  let mockPostService: PostService;
  let mockThreadService: ThreadService;
  let mockLimiter: Bottleneck;

  beforeEach(() => {
    mockDB = {
      threadRepository: {
        findByUUIDs: jest.fn(),
      },
      postRepository: {
        findByUUIDs: jest.fn(),
      },
    } as unknown as DB;

    mockPostService = new PostService(mockDB);
    mockThreadService = new ThreadService(mockDB);

    mockLimiter = new Bottleneck({
      maxConcurrent: 1,
      minTime: 1,
    });

    jest.spyOn(mockLimiter, "schedule").mockImplementation((fn: any) => fn());

    webhoseService = new WebhoseService(
      mockDB,
      mockPostService,
      mockThreadService,
      mockLimiter
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("fetchAndStorePosts", () => {
    it("should fetch and store posts until no more results are available", async () => {
      const mockPosts = Array.from({ length: 10 }, createMockPostApiData);

      jest.spyOn(webhoseService as any, "fetchPosts").mockResolvedValueOnce({
        posts: mockPosts,
        moreResultsAvailable: 0,
        next: "",
      });

      jest
        .spyOn(webhoseService as any, "storePostsAndThreads")
        .mockResolvedValue(undefined);

      const totalStored = await webhoseService.fetchAndStorePosts({
        queryString: "real-world-query",
      });

      expect(totalStored).toEqual(10);
      expect(webhoseService["fetchPosts"]).toHaveBeenCalledTimes(1);
      expect(webhoseService["storePostsAndThreads"]).toHaveBeenCalledWith(
        mockPosts
      );
    });

    it.each([
      [
        "with multiple pages of results",
        [
          {
            posts: Array.from({ length: 5 }, createMockPostApiData),
            moreResultsAvailable: 10,
            next: "nextPage",
          },
          {
            posts: Array.from({ length: 10 }, createMockPostApiData),
            moreResultsAvailable: 0,
            next: "",
          },
        ],
        15,
      ],
      [
        "with no results available",
        [
          {
            posts: [],
            moreResultsAvailable: 0,
            next: "",
          },
        ],
        0,
      ],
      [
        "with results ending after a single page",
        [
          {
            posts: Array.from({ length: 7 }, createMockPostApiData),
            moreResultsAvailable: 0,
            next: "",
          },
        ],
        7,
      ],
    ])(
      "should fetch and store posts %s",
      async (_, pages, expectedTotalStored) => {
        jest
          .spyOn(webhoseService as any, "fetchPosts")
          .mockResolvedValueOnce(pages[0])
          .mockResolvedValueOnce(pages[1]);

        jest
          .spyOn(webhoseService as any, "storePostsAndThreads")
          .mockResolvedValue(undefined);

        const totalStored = await webhoseService.fetchAndStorePosts({
          queryString: "real-world-query",
        });

        expect(totalStored).toEqual(expectedTotalStored);
        expect(webhoseService["fetchPosts"]).toHaveBeenCalledTimes(
          pages.length
        );
        pages.forEach((page) =>
          expect(webhoseService["storePostsAndThreads"]).toHaveBeenCalledWith(
            page.posts
          )
        );
      }
    );

    it("should invoke callback with progress updates", async () => {
      const mockPosts = Array.from({ length: 5 }, createMockPostApiData);

      jest.spyOn(webhoseService as any, "fetchPosts").mockResolvedValue({
        posts: mockPosts,
        moreResultsAvailable: 0,
        next: "nextPage",
      });

      jest
        .spyOn(webhoseService as any, "storePostsAndThreads")
        .mockResolvedValue(undefined);

      const callback = jest.fn();

      await webhoseService.fetchAndStorePosts(
        { queryString: "real-world-query" },
        callback
      );

      expect(callback).toHaveBeenCalledWith({
        totalStored: 5,
        remainingPosts: 0,
      });
    });

    it("should handle API errors gracefully", async () => {
      jest
        .spyOn(webhoseService as any, "fetchPosts")
        .mockRejectedValueOnce(new Error("Failed to fetch posts from API"));

      await expect(
        webhoseService.fetchAndStorePosts({ queryString: "real-world-query" })
      ).rejects.toThrow("Failed to fetch posts from API");

      expect(webhoseService["fetchPosts"]).toHaveBeenCalledTimes(1);
    });

    it("should handle errors in storePostsAndThreads gracefully", async () => {
      const mockPosts = Array.from({ length: 5 }, createMockPostApiData);

      jest.spyOn(webhoseService as any, "fetchPosts").mockResolvedValueOnce({
        posts: mockPosts,
        moreResultsAvailable: 0,
        next: "",
      });

      jest
        .spyOn(webhoseService as any, "storePostsAndThreads")
        .mockRejectedValueOnce(new Error("Failed to store posts and threads"));

      await expect(
        webhoseService.fetchAndStorePosts({ queryString: "real-world-query" })
      ).rejects.toThrow("Failed to store posts and threads");

      expect(webhoseService["fetchPosts"]).toHaveBeenCalledTimes(1);
      expect(webhoseService["storePostsAndThreads"]).toHaveBeenCalledWith(
        mockPosts
      );
    });
  });

  describe("fetchPosts", () => {
    it("should fetch posts with realistic data", async () => {
      const mockPosts = Array.from({ length: 10 }, createMockPostApiData);
      const mockResponse = {
        posts: mockPosts,
        moreResultsAvailable: 1,
        next: "nextPage",
      };

      (axios.get as jest.Mock).mockResolvedValueOnce({ data: mockResponse });

      const result = await webhoseService["fetchPosts"]("real-world-query", "");

      expect(result.posts).toEqual(mockPosts);
      expect(result.moreResultsAvailable).toEqual(1);
      expect(result.next).toEqual("nextPage");
    });
  });

  describe("storePostsAndThreads", () => {
    it("should correctly process and save posts and threads", async () => {
      const mockPosts = Array.from({ length: 10 }, createMockPostApiData);

      jest.spyOn(webhoseService as any, "fetchExistingData").mockResolvedValue({
        existingThreads: [],
        existingPosts: [],
      });

      jest
        .spyOn(webhoseService as any, "processPostsAndThreads")
        .mockReturnValue({
          newThreads: [new Thread()],
          newPosts: [new Post()],
        });

      jest.spyOn(mockPostService, "saveThreadsAndPosts").mockResolvedValue();

      await webhoseService["storePostsAndThreads"](mockPosts);

      expect(mockPostService.saveThreadsAndPosts).toHaveBeenCalledWith(
        expect.any(Array),
        expect.any(Array)
      );
    });
  });

  describe("fetchExistingData", () => {
    it("should correctly fetch existing data from the database", async () => {
      const mockPosts = Array.from({ length: 10 }, createMockPostApiData);
      const mockThreads = [{ threadUuid: "thread1" }] as Thread[];
      const mockPostsDB = [{ postUuid: "post1" }] as Post[];

      mockDB.threadRepository.findByUUIDs = jest
        .fn()
        .mockResolvedValue(mockThreads);
      mockDB.postRepository.findByUUIDs = jest
        .fn()
        .mockResolvedValue(mockPostsDB);

      const result = await webhoseService["fetchExistingData"](mockPosts);

      expect(result.existingThreads).toEqual(mockThreads);
      expect(result.existingPosts).toEqual(mockPostsDB);
    });
  });
});
