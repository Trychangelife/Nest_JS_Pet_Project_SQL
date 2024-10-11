import { Model } from "mongoose";
import { BlogsType } from "src/blogs/dto/BlogsType";
export declare class BlogsRepository {
    protected blogsModel: Model<BlogsType>;
    constructor(blogsModel: Model<BlogsType>);
    getAllBlogs(skip: number, limit?: number, searchNameTerm?: string | null, page?: number, sortBy?: string, sortDirection?: string): Promise<object>;
    targetBloggers(id: string, userId?: string): Promise<object | undefined>;
    createBlogger(newBlogger: BlogsType): Promise<BlogsType | null>;
    changeBlogger(id: string, name: any, websiteUrl: string, description: string): Promise<boolean>;
    deleteBlogger(id: string): Promise<boolean>;
    deleteAllBlogs(): Promise<boolean>;
}
