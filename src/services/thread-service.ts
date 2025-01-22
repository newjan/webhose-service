import { Thread } from "@/models/thread-model";
import { DB, RequiredEntityData } from "@/configs/db";

export class ThreadService {
  private db: DB;

  constructor(db: DB) {
    this.db = db;
  }

  /**
   * Fetch existing threads by UUIDs.
   * @param threadUuids The UUIDs of threads to fetch.
   * @returns An array of existing threads.
   */
  public async fetchExistingThreads(threadUuids: string[]): Promise<Thread[]> {
    return this.db.threadRepository.findByUUIDs(threadUuids);
  }

  /**
   * Create a new thread.
   * @param thread The thread to create.
   * @returns The newly created thread.
   */
  public createThread(thread: RequiredEntityData<Thread>): Thread {
    return this.db.threadRepository.create(thread);
  }
}
