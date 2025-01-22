import { Thread } from "@/models/thread-model";
import { BaseRepository } from "@/repositories/base-repository";

export class ThreadRepository extends BaseRepository<Thread> {
  findByUUIDs(uuids: string[]): Promise<Thread[]> {
    return this.find({ threadUuid: { $in: uuids } });
  }
}
