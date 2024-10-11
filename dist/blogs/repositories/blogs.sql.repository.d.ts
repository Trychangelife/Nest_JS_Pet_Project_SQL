import { BlogsType } from "src/blogs/dto/BlogsType";
import { DataSource } from "typeorm";
export declare class BlogsRepositorySql {
    protected dataSource: DataSource;
    constructor(dataSource: DataSource);
    allBloggers(skip: number, limit?: number, searchNameTerm?: string | null, page?: number): Promise<object>;
    targetBloggers(id: string): Promise<object | undefined>;
    createBlogger(newBlogger: BlogsType): Promise<BlogsType | null>;
    changeBlogger(id: string, name: any, websiteUrl: string): Promise<boolean>;
    deleteBlogger(id: string): Promise<boolean>;
    deleteAllBlogger(): Promise<boolean>;
}
