import { BlogsRepository } from "src/blogs/repositories/blogs.repository";
export declare class UpdateBlogByBloggerCommand {
    id: string;
    name: any;
    websiteUrl: string;
    description: string;
    constructor(id: string, name: any, websiteUrl: string, description: string);
}
export declare class UpdateBlogByBloggerUseCase {
    protected bloggerRepository: BlogsRepository;
    constructor(bloggerRepository: BlogsRepository);
    execute(command: UpdateBlogByBloggerCommand): Promise<string>;
}
