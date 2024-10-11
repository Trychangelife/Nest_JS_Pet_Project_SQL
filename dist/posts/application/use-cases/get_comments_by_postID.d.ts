import { PostRepository } from "src/posts/repositories/posts.repository";
export declare class GetCommentByPostIdCommand {
    postId: string;
    page: number;
    pageSize: number;
    userId?: string;
    sortBy?: string;
    sortDirection?: string;
    constructor(postId: string, page: number, pageSize: number, userId?: string, sortBy?: string, sortDirection?: string);
}
export declare class GetCommentByPostIdUseCase {
    protected postsRepository: PostRepository;
    constructor(postsRepository: PostRepository);
    execute(command: GetCommentByPostIdCommand): Promise<object | boolean>;
}
