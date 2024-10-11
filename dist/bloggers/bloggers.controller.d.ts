import { JwtServiceClass } from "../guards/jwt.service";
import { PostTypeValidator } from "src/posts/dto/PostTypeValidator";
import { CommandBus } from "@nestjs/cqrs";
import { Blogs } from "src/blogs/dto/Blog_validator_type";
import { BloggersType } from "./dto/Bloggers.Blogs.Type";
export declare class BloggersController {
    protected jwtServiceClass: JwtServiceClass;
    private commandBus;
    constructor(jwtServiceClass: JwtServiceClass, commandBus: CommandBus);
    getAllBloggers(query: {
        searchNameTerm: string;
        pageNumber: string;
        pageSize: string;
        sortBy: string;
        sortDirection: string;
    }, req: any): Promise<object>;
    createBlogger(blogsType: Blogs, req: any): Promise<BloggersType>;
    createPostByBloggerId(params: any, post: PostTypeValidator, req: any): Promise<string | object>;
    updateBlogger(params: any, blogsType: Blogs, req: any): Promise<void>;
    updatePost(params: any, postInput: PostTypeValidator, req: any): Promise<void>;
    deleteOneBlog(params: any, req: any): Promise<void>;
    deletePostById(params: any, req: any): Promise<void>;
}
