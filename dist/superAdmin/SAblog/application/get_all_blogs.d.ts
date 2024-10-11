import { BlogsSuperAdminRepository } from "../repositories/blogs.SA.repository";
export declare class GetAllBlogsSuperAdminCommand {
    pageSize: number;
    pageNumber: number;
    searchNameTerm?: string | null;
    sortBy?: string;
    sortDirection?: string;
    constructor(pageSize: number, pageNumber: number, searchNameTerm?: string | null, sortBy?: string, sortDirection?: string);
}
export declare class GetAllBlogsSuperAdminUseCase {
    protected blogsSuperAdminRepository: BlogsSuperAdminRepository;
    constructor(blogsSuperAdminRepository: BlogsSuperAdminRepository);
    execute(command: GetAllBlogsSuperAdminCommand): Promise<object>;
}
