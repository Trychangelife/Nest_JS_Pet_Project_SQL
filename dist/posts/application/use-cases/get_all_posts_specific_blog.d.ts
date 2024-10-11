import { PostRepository } from "src/posts/repositories/posts.repository";
export declare class GetAllPostsSpecificBlogCommand {
    bloggerId: string;
    page?: number;
    pageSize?: number;
    userId?: string;
    constructor(bloggerId: string, page?: number, pageSize?: number, userId?: string);
}
export declare class GetAllPostsSpecificBlogUseCase {
    protected postsRepository: PostRepository;
    constructor(postsRepository: PostRepository);
    execute(command: GetAllPostsSpecificBlogCommand): Promise<object | undefined>;
}
