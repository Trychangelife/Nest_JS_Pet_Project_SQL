import 'dotenv/config'
import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { PostRepository } from "../repositories/posts.repository"
import { v4 as uuidv4 } from "uuid"
import { DataSource } from 'typeorm'
import { InjectDataSource } from '@nestjs/typeorm'
import { LIKES } from '../../utils/types'
import { Comments } from "src/comments/dto/CommentsClass"
import { CommentsType } from "src/comments/dto/CommentsType"
import { PostsType } from "src/posts/dto/PostsType"
import { PostClass } from "src/posts/dto/PostClass"
import { BlogsType } from "src/blogs/dto/BlogsType"


//@Injectable()
export class PostsService {

    constructor (
        //protected postsRepository: PostRepository, 
        //@InjectModel('Blogs') protected bloggerModel: Model<BlogsType>,
        //@InjectModel('Posts') protected postsModel: Model<PostsType>,
        //@InjectDataSource() protected dataSource: DataSource
        ) {}

    // async allPosts(pageSize: number, pageNumber: number, userId?: string): Promise<object> {
    //     let skip = 0
    //     if (pageNumber && pageSize) {
    //         skip = (pageNumber - 1) * pageSize
    //     }
    //     return this.postsRepository.allPosts(skip, pageSize, pageNumber, userId)
    // }
    // async targetPosts(postId: string, userId?: string): Promise<object | undefined> {
    //     return await this.postsRepository.targetPosts(postId, userId)
    // }
    // async allPostsSpecificBlogger(bloggerId: string, page?: number, pageSize?: number, userId?: string): Promise<object | undefined> {
    //     let skip = 0
    //     if (page && pageSize) {
    //         skip = (page - 1) * pageSize
    //     }

    //     return await this.postsRepository.allPostsSpecificBlogger(bloggerId, skip, pageSize, page, userId)
    // }
    // async releasePost(title: string, content: string, shortDescription: string, bloggerId?: string, bloggerIdUrl?: string): Promise<object | string | null> {
    //     //FOR SQL DATABASE
    //     if (process.env.USE_DATABASE === "SQL") {
    //         const foundBlogger = await this.dataSource.query(`SELECT * FROM "Bloggers" WHERE id = $1`, [bloggerId])
    //     if (foundBlogger.length >= 1 && bloggerId) {
    //         // CREATE ON CLASS
    //         const newPost = new PostClass(uuidv4(), title, content, shortDescription, bloggerId, foundBlogger[0].name, (new Date()).toISOString(), {likesCount: 0, dislikesCount: 0, myStatus: LIKES.NONE})
    //         console.log(newPost)
    //         return await this.postsRepository.releasePost(newPost, bloggerId, bloggerIdUrl)
    //     }
    //     else { return null }
    //     }
    //     // FOR MONGO DATABASE
    //     else {
    //     const foundBlogger = await this.bloggerModel.findOne({ id: bloggerId }).lean()
    //     const foundBloggerW = await this.bloggerModel.findOne({ id: bloggerIdUrl }).lean()
    //     if (bloggerIdUrl && foundBloggerW !== null) {
    //         // Построено на классе
    //         const newPost = new PostClass(uuidv4(), title, content, shortDescription, bloggerIdUrl, foundBloggerW.name, (new Date()).toISOString(), {likesCount: 0, dislikesCount: 0, myStatus: LIKES.NONE})
        
    //         return await this.postsRepository.releasePost(newPost, bloggerIdUrl)
    //     }
    //     else if (foundBlogger !== null && bloggerId) {
    //         // Построено на классе
    //         const newPost = new PostClass(uuidv4(), title, content, shortDescription, bloggerId, foundBlogger.name,(new Date()).toISOString(), {likesCount: 0, dislikesCount: 0, myStatus: LIKES.NONE})
    
    //         return await this.postsRepository.releasePost(newPost, bloggerId, bloggerIdUrl)
    //     }
    //     else { return null }
    // }
    // }
    // async changePost(postId: string, title: string, shortDescription: string, content: string, bloggerId: string): Promise<string | object> {

    //     return await this.postsRepository.changePost(postId, title, shortDescription, content, bloggerId)
    // }
    // async deletePost(deleteId: string): Promise<boolean> {
    //     return await this.postsRepository.deletePost(deleteId)

    // }
    // async createCommentForSpecificPost(postId: string, content: string, userId: string, userLogin: string): Promise<CommentsType | boolean> {
    //     const foundPost = await this.postsModel.findOne({ id: postId })
    //     if(foundPost) {
    //     // CREATE ON CLASS
    //     const createdComment = new Comments(uuidv4(), content, {userId: userId, userLogin: userLogin}, (new Date()).toISOString(), postId, {likesCount: 0, dislikesCount: 0, myStatus: LIKES.NONE})
    //     return this.postsRepository.createCommentForSpecificPost(createdComment)
    // }
    //     if (foundPost == null) {
    //         return false}
    //         else {
    //             return false
    //         }
    // }
    // async takeCommentByIdPost (postId: string, page: number, pageSize: number, userId?: string, sortBy?: string, sortDirection?: string): Promise<object | boolean> {
    //     let skip = 0
    //     if (page && pageSize) {
    //         skip = (page - 1) * pageSize
    //     }
    //     return await this.postsRepository.takeCommentByIdPost(postId, skip, pageSize, page, userId, sortBy, sortDirection)
    // }
    // async like_dislike (postId: string, likeStatus: LIKES, userId: string, login: string): Promise<string | object> {
    //     return await this.postsRepository.like_dislike(postId, likeStatus, userId, login)
    // }
}