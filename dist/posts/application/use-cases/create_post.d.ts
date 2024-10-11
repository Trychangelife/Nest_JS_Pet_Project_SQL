import { Model } from "mongoose";
import { BlogsType } from "src/blogs/dto/BlogsType";
import { PostRepository } from "src/posts/repositories/posts.repository";
import { DataSource } from "typeorm";
export declare class CreatePostCommand {
    title: string;
    content: string;
    shortDescription: string;
    userId?: string;
    blogId?: string;
    blogIdUrl?: string;
    constructor(title: string, content: string, shortDescription: string, userId?: string, blogId?: string, blogIdUrl?: string);
}
export declare class CreatePostUseCase {
    protected postsRepository: PostRepository;
    protected bloggerModel: Model<BlogsType>;
    protected dataSource: DataSource;
    constructor(postsRepository: PostRepository, bloggerModel: Model<BlogsType>, dataSource: DataSource);
    execute(command: CreatePostCommand): Promise<object | string | null>;
}
