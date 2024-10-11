import { Model } from "mongoose";
import { BlogsType } from "src/blogs/dto/BlogsType";
import { BloggersType } from "../dto/Bloggers.Blogs.Type";
export declare class BlogsByBloggerRepository {
    protected blogsModel: Model<BlogsType>;
    constructor(blogsModel: Model<BlogsType>);
    getAllBlogsForSpecificBlogger(skip: number, limit?: number, searchNameTerm?: string | null, page?: number, sortBy?: string, sortDirection?: string, userId?: string): Promise<object>;
    targetBloggers(id: string): Promise<object | undefined>;
    createBlogger(newBlogger: BloggersType): Promise<BloggersType | null>;
    changeBlogger(id: string, name: any, websiteUrl: string, description: string): Promise<boolean>;
    deleteBlogForSpecificBlogger(blogId: string, userId: string): Promise<boolean>;
    deleteAllBlogs(): Promise<boolean>;
}
