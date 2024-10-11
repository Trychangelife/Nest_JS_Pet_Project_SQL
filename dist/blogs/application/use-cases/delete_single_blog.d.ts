import { BlogsRepository } from "src/blogs/repositories/blogs.repository";
export declare class DeleteBlogCommand {
    id: string;
    constructor(id: string);
}
export declare class DeleteBlogUseCase {
    protected bloggerRepository: BlogsRepository;
    constructor(bloggerRepository: BlogsRepository);
    execute(command: DeleteBlogCommand): Promise<string>;
}
