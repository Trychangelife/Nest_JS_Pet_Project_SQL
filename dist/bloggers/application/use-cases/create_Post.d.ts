import { Model } from "mongoose";
import { BlogsType } from "src/blogs/dto/BlogsType";
import { PostRepository } from "src/posts/repositories/posts.repository";
import { DataSource } from "typeorm";
export declare class CreatePostByBloggerCommand {
    title: string;
    content: string;
    shortDescription: string;
    blogId?: string;
    constructor(title: string, content: string, shortDescription: string, blogId?: string);
}
export declare class CreatePostByBloggerUseCase {
    protected postsRepository: PostRepository;
    protected bloggerModel: Model<BlogsType>;
    protected dataSource: DataSource;
    constructor(postsRepository: PostRepository, bloggerModel: Model<BlogsType>, dataSource: DataSource);
    execute(command: CreatePostByBloggerCommand): Promise<object | string | null>;
}
