import { BlogsType } from "src/blogs/dto/BlogsType";
import { BlogsRepository } from "src/blogs/repositories/blogs.repository";
export declare class CreateBlogCommand {
    name: string;
    websiteUrl: string;
    description: string;
    constructor(name: string, websiteUrl: string, description: string);
}
export declare class CreateBlogUseCase {
    protected bloggerRepository: BlogsRepository;
    constructor(bloggerRepository: BlogsRepository);
    execute(command: CreateBlogCommand): Promise<BlogsType | null>;
}
