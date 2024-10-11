import { PostRepository } from "src/posts/repositories/posts.repository";
export declare class GetAllPostsCommand {
    pageSize: number;
    pageNumber: number;
    userId?: string;
    constructor(pageSize: number, pageNumber: number, userId?: string);
}
export declare class GetAllPostsUseCase {
    protected postsRepository: PostRepository;
    constructor(postsRepository: PostRepository);
    execute(command: GetAllPostsCommand): Promise<object>;
}
