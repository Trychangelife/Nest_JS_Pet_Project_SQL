import { JwtServiceClass } from "../guards/jwt.service";
import { BlogsType } from "src/blogs/dto/BlogsType";
import { PostTypeValidator } from "src/posts/dto/PostTypeValidator";
import { CommandBus } from "@nestjs/cqrs";
import { Blogs } from "src/blogs/dto/Blog_validator_type";
export declare class BlogsController {
    protected jwtServiceClass: JwtServiceClass;
    private commandBus;
    constructor(jwtServiceClass: JwtServiceClass, commandBus: CommandBus);
    getAllBloggers(query: {
        searchNameTerm: string;
        pageNumber: string;
        pageSize: string;
        sortBy: string;
        sortDirection: string;
    }): Promise<object>;
    getBloggerById(id: string): Promise<object>;
    getPostByBloggerID(query: {
        SearchNameTerm: string;
        PageNumber: string;
        PageSize: string;
        sortBy: string;
        sortDirection: string;
    }, params: any, req: any): Promise<object>;
    createBlogger(blogsType: Blogs): Promise<BlogsType>;
    createPostByBloggerId(params: any, post: PostTypeValidator): Promise<string | object>;
    updateBlogger(params: any, blogsType: Blogs): Promise<void>;
    deleteOneBlogger(params: any): Promise<void>;
}
