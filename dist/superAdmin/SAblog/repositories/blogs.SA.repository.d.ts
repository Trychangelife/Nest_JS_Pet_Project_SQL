import { Model } from "mongoose";
import { BlogsType } from "src/blogs/dto/BlogsType";
import { UsersType } from "src/users/dto/UsersType";
export declare class BlogsSuperAdminRepository {
    protected blogsModel: Model<BlogsType>;
    constructor(blogsModel: Model<BlogsType>);
    getAllBlogs(skip: number, limit?: number, searchNameTerm?: string | null, page?: number, sortBy?: string, sortDirection?: string): Promise<object>;
    targetBloggers(id: string): Promise<object | undefined>;
    createBlogger(newBlogger: BlogsType): Promise<BlogsType | null>;
    changeBlogger(id: string, name: any, websiteUrl: string, description: string): Promise<boolean>;
    deleteBlogger(id: string): Promise<boolean>;
    deleteAllBlogs(): Promise<boolean>;
    BindingBlogToUserById(blogId: string, userId: string, user: UsersType): Promise<boolean>;
}
