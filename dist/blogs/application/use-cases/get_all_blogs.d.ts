import { BlogsRepository } from "src/blogs/repositories/blogs.repository";
export declare class GetAllBlogsCommand {
    pageSize: number;
    pageNumber: number;
    searchNameTerm?: string | null;
    sortBy?: string;
    sortDirection?: string;
    constructor(pageSize: number, pageNumber: number, searchNameTerm?: string | null, sortBy?: string, sortDirection?: string);
}
export declare class GetAllBlogsUseCase {
    protected bloggerRepository: BlogsRepository;
    constructor(bloggerRepository: BlogsRepository);
    execute(command: GetAllBlogsCommand): Promise<object>;
}
