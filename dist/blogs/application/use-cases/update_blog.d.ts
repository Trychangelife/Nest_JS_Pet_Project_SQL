import { BlogsRepository } from "src/blogs/repositories/blogs.repository";
export declare class UpdateBlogCommand {
    id: string;
    name: any;
    websiteUrl: string;
    description: string;
    constructor(id: string, name: any, websiteUrl: string, description: string);
}
export declare class UpdateBlogUseCase {
    protected bloggerRepository: BlogsRepository;
    constructor(bloggerRepository: BlogsRepository);
    execute(command: UpdateBlogCommand): Promise<string>;
}
