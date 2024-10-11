import { PostRepository } from "src/posts/repositories/posts.repository";
import { CommentsType } from "src/comments/dto/CommentsType";
export declare class CreateCommentForSpecificPostCommand {
    postId: string;
    content: string;
    userId: string;
    userLogin: string;
    constructor(postId: string, content: string, userId: string, userLogin: string);
}
export declare class CreateCommentForSpecificPostUseCase {
    protected postsRepository: PostRepository;
    constructor(postsRepository: PostRepository);
    execute(command: CreateCommentForSpecificPostCommand): Promise<CommentsType | boolean>;
}
