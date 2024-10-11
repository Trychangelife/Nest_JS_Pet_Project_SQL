import { BloggersType } from "src/bloggers/dto/Bloggers.Blogs.Type";
import { BlogsByBloggerRepository } from "src/bloggers/repositories/bloggers.repository";
export declare class CreateBlogByBloggerCommand {
    name: string;
    websiteUrl: string;
    description: string;
    userId: string;
    userLogin: string;
    constructor(name: string, websiteUrl: string, description: string, userId: string, userLogin: string);
}
export declare class CreateBlogByBloggerUseCase {
    protected bloggerRepository: BlogsByBloggerRepository;
    constructor(bloggerRepository: BlogsByBloggerRepository);
    execute(command: CreateBlogByBloggerCommand): Promise<BloggersType | null>;
}
