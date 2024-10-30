import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { InjectDataSource } from "@nestjs/typeorm"
import { Model } from "mongoose"
import { BlogsType } from "src/blogs/dto/BlogsType"
import { UsersType } from "src/users/dto/UsersType"
import { DataSource } from "typeorm"


@Injectable()
export class BlogsSuperAdminRepository {

    constructor(
        @InjectDataSource() protected dataSource: DataSource
    ) {
        
    }
    async getAllBlogs(
        skip: number, 
        limit: number = 10, 
        searchNameTerm?: string | null, 
        pageNumber: number = 1, 
        sortBy: string = 'created_at', 
        sortDirection: string = 'desc'
    ): Promise<object> {
    
        // Базовый SQL-запрос и дополнительные параметры
        const searchCondition = searchNameTerm ? `WHERE name ILIKE $1` : '';
        const queryParams = searchNameTerm ? [`%${searchNameTerm}%`, limit, skip] : [limit, skip];
    
        // Запрос для общего количества блогов
        const [totalCountResult] = await this.dataSource.query(`SELECT COUNT(*)::int AS count FROM "blog"`);
        const totalCount = parseInt(totalCountResult.count, 10);
        const pagesCount = Math.ceil(totalCount / limit);
    
        // Основной SQL-запрос для получения блогов с учетом параметров
        const getAllBlog = await this.dataSource.query(
            `
            SELECT * 
            FROM "blog"
            ${searchCondition}
            ORDER BY ${sortBy} ${sortDirection}
            LIMIT $${queryParams.length - 1} OFFSET $${queryParams.length}
            `,
            queryParams
        );
    
        // Возвращаем форматированный объект
        return {
            pagesCount,
            page: pageNumber,
            pageSize: limit,
            totalCount,
            items: getAllBlog.map(blog => ({
                id: blog.id.toString(),
                name: blog.name,
                description: blog.description,
                websiteUrl: blog.website_url,
                createdAt: blog.created_at,
                isMembership: blog.is_membership,
            }))
        };
    }
    // async targetBloggers(id: string): Promise<object | undefined> {
    //     const blogger: BlogsType | null = await this.blogsModel.findOne({ id: id }, modelViewBloggers).lean()
    //     if (blogger !== null) {
    //         return blogger
    //     }
    //     else {
    //         false
    //     }
    // }
    // async createBlogger(newBlogger: BlogsType): Promise<BlogsType | null> {
    //     await this.blogsModel.create(newBlogger)
    //     return await this.blogsModel.findOne({ id: newBlogger.id }, modelViewBloggers).lean()
    // }
    // async changeBlogger(id: string, name: any, websiteUrl: string, description: string): Promise<boolean> {
    //     const result = await this.blogsModel.updateOne({ id: id }, { $set: { name: name, websiteUrl: websiteUrl, description: description } })
    //     return result.matchedCount === 1
    // }
    // async deleteBlogger(id: string): Promise<boolean> {
    //     const result = await this.blogsModel.deleteOne({ id: id })
    //     return result.deletedCount === 1
    // }
    // async deleteAllBlogs(): Promise<boolean> {
    //     const afterDelete = await this.blogsModel.deleteMany({})
    //     return afterDelete.acknowledged
    // } 
    
    // async BindingBlogToUserById(blogId: string, userId: string, user: UsersType): Promise<boolean> {
    //     if (blogId && userId) {
    //         const result = await this.blogsModel.updateOne({ id: blogId }, { $set: { "blogOwnerInfo.userId": user.id, "blogOwnerInfo.userLogin": user.login } })
    //         return result.matchedCount === 1
    //     }
    //     else {
    //         return false
    //     }
    // }
}