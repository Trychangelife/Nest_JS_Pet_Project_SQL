import { PostRepository } from "src/posts/repositories/posts.repository";
import { LIKES } from "src/utils/types";
export declare class LikeDislikeForPostCommand {
    postId: string;
    likeStatus: LIKES;
    userId: string;
    login: string;
    constructor(postId: string, likeStatus: LIKES, userId: string, login: string);
}
export declare class LikeDislikeForPostUseCase {
    protected postsRepository: PostRepository;
    constructor(postsRepository: PostRepository);
    execute(command: LikeDislikeForPostCommand): Promise<string | object>;
}
