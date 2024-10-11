import { BlogsRepository } from "src/blogs/repositories/blogs.repository";
export declare class GetTargetBlogCommand {
    blogId: string;
    userId?: string;
    constructor(blogId: string, userId?: string);
}
export declare class GetTargetBlogUseCase {
    protected bloggerRepository: BlogsRepository;
    constructor(bloggerRepository: BlogsRepository);
    execute(command: GetTargetBlogCommand): Promise<object | undefined>;
}
