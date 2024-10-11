import { PostRepository } from "src/posts/repositories/posts.repository";
export declare class GetSinglePostCommand {
    postId: string;
    userId?: string;
    description?: string;
    constructor(postId: string, userId?: string, description?: string);
}
export declare class GetSinglePostUseCase {
    protected postsRepository: PostRepository;
    constructor(postsRepository: PostRepository);
    execute(command: GetSinglePostCommand): Promise<object | undefined>;
}
