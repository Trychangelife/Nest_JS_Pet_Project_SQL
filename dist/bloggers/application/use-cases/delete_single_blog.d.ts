import { BlogsByBloggerRepository } from "src/bloggers/repositories/bloggers.repository";
export declare class DeleteBlogForSpecificBloggerCommand {
    blogId: string;
    userId: string;
    constructor(blogId: string, userId: string);
}
export declare class DeleteBlogForSpecificBloggerUseCase {
    protected bloggerRepository: BlogsByBloggerRepository;
    constructor(bloggerRepository: BlogsByBloggerRepository);
    execute(command: DeleteBlogForSpecificBloggerCommand): Promise<boolean>;
}
