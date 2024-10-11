import { CommandBus } from "@nestjs/cqrs";
export declare class SuperAdminBlogsController {
    private commandBus;
    constructor(commandBus: CommandBus);
    getAllBlogs(query: {
        searchNameTerm: string;
        pageNumber: string;
        pageSize: string;
        sortBy: string;
        sortDirection: string;
    }): Promise<object>;
    updateBlogger(params: any): Promise<void>;
}
