import { CommandHandler } from "@nestjs/cqrs"
import { InjectModel } from "@nestjs/mongoose"
import { InjectDataSource } from "@nestjs/typeorm"
import { Model } from "mongoose"
import { BlogsType, BlogsTypeView } from "src/blogs/dto/BlogsType"
import { BlogsRepositorySql } from "src/blogs/repositories/blogs.sql.repository"
import { PostClass } from "src/posts/dto/PostClass"
import { PostsRepositorySql } from "src/posts/repositories/posts.sql.repository"
import { LIKES } from "src/utils/types"
import { DataSource } from "typeorm"
import { v4 as uuidv4 } from "uuid"


export class CreatePostCommand {
    constructor(
        public title: string, 
        public content: string, 
        public shortDescription: string,
        public userId?: string, 
        public blogId?: string, 
        public blogIdUrl?: string,) {
        
    }
}

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase {
    constructor (
        protected postsRepository: PostsRepositorySql,
        protected blogRepository: BlogsRepositorySql,
        ) {}

    async execute(command: CreatePostCommand): Promise<object | string | null> {
        // Кладем в второй параметр TRUE т.к это внутренний запрос, ожидаем полное тело из БД
            const foundBlog: BlogsType = await this.blogRepository.targetBlogAdmin(command.blogId, command?.userId)
        if (foundBlog && command.blogId) {
            // CREATE ON CLASS
            const newPost = new PostClass(uuidv4(), command.title, command.content, command.shortDescription, command.blogId, foundBlog.name, (new Date()).toISOString(),foundBlog.owner_user_id, {likesCount: 0, dislikesCount: 0, myStatus: LIKES.NONE})
            return await this.postsRepository.releasePost(newPost, foundBlog)
        }
        else { return null }       
    }
}

