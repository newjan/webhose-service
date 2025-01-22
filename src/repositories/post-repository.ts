import { Post } from "@/models/post-model";
import { BaseRepository } from "@/repositories/base-repository";

export class PostRepository extends BaseRepository<Post> {
    findByUUIDs(uuids: string[]): Promise<Post[]> {
        return this.find({ postUuid: { $in: uuids } });
    }
}
