import { BlogsByBloggerRepository } from "src/bloggers/repositories/bloggers.repository";
export declare class GetAllBlogsforBloggerCommand {
    pageSize: number;
    pageNumber: number;
    searchNameTerm?: string | null;
    sortBy?: string;
    sortDirection?: string;
    userId?: string;
    constructor(pageSize: number, pageNumber: number, searchNameTerm?: string | null, sortBy?: string, sortDirection?: string, userId?: string);
}
export declare class GetAllBlogsforBloggerUseCase {
    protected bloggerRepository: BlogsByBloggerRepository;
    constructor(bloggerRepository: BlogsByBloggerRepository);
    execute(command: GetAllBlogsforBloggerCommand): Promise<object>;
}
