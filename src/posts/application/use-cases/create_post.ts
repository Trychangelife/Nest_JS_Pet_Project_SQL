import { CommandHandler } from "@nestjs/cqrs"
import { InjectModel } from "@nestjs/mongoose"
import { InjectDataSource } from "@nestjs/typeorm"
import { Model } from "mongoose"
import { BlogsType } from "src/blogs/dto/BlogsType"
import { PostClass } from "src/posts/dto/PostClass"
import { PostRepository } from "src/posts/repositories/posts.repository"
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
        protected postsRepository: PostRepository,
        @InjectModel('Blogs') protected bloggerModel: Model<BlogsType>,
        @InjectDataSource() protected dataSource: DataSource ) {}

    async execute(command: CreatePostCommand): Promise<object | string | null> {
        //FOR SQL DATABASE
        if (process.env.USE_DATABASE === "SQL") {
            const foundBlogger = await this.dataSource.query(`SELECT * FROM "Bloggers" WHERE id = $1`, [command.blogId])
        if (foundBlogger.length >= 1 && command.blogId) {
            // CREATE ON CLASS
            const newPost = new PostClass(uuidv4(), command.title, command.content, command.shortDescription, command.blogId, foundBlogger[0].name, (new Date()).toISOString(),foundBlogger.blogOwnerInfo.userId, {likesCount: 0, dislikesCount: 0, myStatus: LIKES.NONE})
            return await this.postsRepository.releasePost(newPost, command.blogId, command.blogIdUrl)
        }
        else { return null }
        }
        // FOR MONGO DATABASE
        else {
        const foundBlogger = await this.bloggerModel.findOne({ id: command.blogId }).lean()
        const foundBloggerW = await this.bloggerModel.findOne({ id: command.blogIdUrl }).lean()
        if (command.blogIdUrl && foundBloggerW !== null) {
            // Построено на классе
            const newPost = new PostClass(uuidv4(), command.title, command.content, command.shortDescription, command.blogIdUrl, foundBloggerW.name, (new Date()).toISOString(), foundBlogger.blogOwnerInfo.userId,{likesCount: 0, dislikesCount: 0, myStatus: LIKES.NONE})
        
            return await this.postsRepository.releasePost(newPost, command.blogIdUrl)
        }
        else if (foundBlogger !== null && command.blogId) {
            // Построено на классе
            const newPost = new PostClass(uuidv4(), command.title, command.content, command.shortDescription, command.blogId, foundBlogger.name,(new Date()).toISOString(), foundBlogger.blogOwnerInfo.userId, {likesCount: 0, dislikesCount: 0, myStatus: LIKES.NONE})
    
            return await this.postsRepository.releasePost(newPost, command.blogId, command.blogIdUrl)
        }
        else { return null }
    }
    }
}

