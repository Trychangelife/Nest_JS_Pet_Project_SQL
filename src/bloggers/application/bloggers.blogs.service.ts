// import { BlogsRepository } from "../repositories/blogs.repository"
// import { v4 as uuidv4 } from "uuid"
// import { Injectable, Scope } from "@nestjs/common"
// import { BlogsClass } from "src/blogs/dto/BlogsClass"
// import { BlogsType } from "src/blogs/dto/BlogsType"



// @Injectable()
// export class BlogsService { 

    
//     constructor (protected bloggerRepository: BlogsRepository) {
//     }

//     // async getAllBlogs(pageSize: number, pageNumber: number, searchNameTerm?: string | null, sortBy?: string, sortDirection?: string): Promise<object> {
//     //     let skip = 0
//     //     if (pageNumber && pageSize) {
//     //         skip = (pageNumber - 1) * pageSize
//     //     }
//     //     const bloggers = await this.bloggerRepository.getAllBlogs(skip, pageSize, searchNameTerm, pageNumber, sortBy, sortDirection)
//     //     return bloggers
//     // }
//     // async targetBloggers(id: string): Promise<object | undefined> {

//     //     return this.bloggerRepository.targetBloggers(id)
//     // }
//     // async createBlogger(name: string, websiteUrl: string, description: string): Promise<BlogsType | null> {
//     //     // Построено на классе
//     //     const newBlogs = new BlogsClass(uuidv4(), name, description, websiteUrl, (new Date()).toISOString(), false)
//     //     const createdBlogs = await this.bloggerRepository.createBlogger(newBlogs)
//     //     return createdBlogs
//     // }
//     // async changeBlogs(id: string, name: any, websiteUrl: string): Promise<string> {
//     //     const afterUpdate = await this.bloggerRepository.changeBlogger(id, name, websiteUrl)
//     //     if (afterUpdate == true) {
//     //         return "update";
//     //     }
//     //     else {
//     //         return "404"
//     //     }
//     // }
//     // async deleteBlogger(id: string): Promise<string> {
//     //     const result = await this.bloggerRepository.deleteBlogger(id)
//     //     if (result == true) {
//     //         return "204"
//     //     }
//     //     else {
//     //         return "404"
//     //     }
//     // }
//     // async deleteAllBlogs(): Promise<boolean> {
//     //     return await this.bloggerRepository.deleteAllBlogs()
//     // }
// }