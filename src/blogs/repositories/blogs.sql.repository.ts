import { Injectable } from "@nestjs/common"
import { InjectDataSource } from "@nestjs/typeorm"
import { BlogsType, BlogsTypeView } from "src/blogs/dto/BlogsType"
import { DataSource } from "typeorm"


@Injectable()
export class BlogsRepositorySql {

    constructor(@InjectDataSource() protected dataSource: DataSource) {

    }

    async allBlogs(
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

    
    async targetBlog(id: string, userId?: string): Promise<object | undefined> {

        const [blog] = await this.dataSource.query(
            `
        SELECT * 
        FROM "blog" WHERE id = $1
            `, [id])
        if (blog !== null) {

            const resultView: BlogsTypeView = {
                id: blog.id.toString(),
                name: blog.name,
                description: blog.description,
                websiteUrl: blog.website_url,
                createdAt: blog.created_at,
                isMembership: blog.is_membership
            }
            return resultView
        }
        else {
            return
        }
    }
    async createBlogger(newBlogger: BlogsType): Promise<BlogsTypeView | null> {
        
        
        const [bloggerAfterCreate] = await this.dataSource.query(`
        INSERT INTO "blog" (name, "website_url", description, created_at)
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `, [newBlogger.name, newBlogger.website_url, newBlogger.description, newBlogger.created_at])

        const resultView: BlogsTypeView = {
            id: bloggerAfterCreate.id.toString(),
            name: bloggerAfterCreate.name,
            description: bloggerAfterCreate.description,
            websiteUrl: bloggerAfterCreate.website_url,
            createdAt: bloggerAfterCreate.created_at,
            isMembership: bloggerAfterCreate.is_membership
        }

        return resultView
    }

    async changeBlogger(
        id: string, 
        name: string, 
        websiteUrl: string, 
        description: string
    ): Promise<boolean> {
    
        const existingBlog = await this.dataSource.query(
            `SELECT id FROM "blog" WHERE id = $1`, 
            [id]
        );
        
        if (existingBlog.length === 0) {
            // Если блог с указанным id не найден, возвращаем false сразу
            return false;
        }
        
        // Выполняем обновление, если объект найден
        const updatedBlogs = await this.dataSource.query(
            `
            UPDATE "blog"
            SET name = $2, website_url = $3, description = $4
            WHERE id = $1
            RETURNING *
            `,
            [id, name, websiteUrl, description]
        );
        
        return updatedBlogs.length > 0;
        
    }
    
    
    async deleteBlogger(id: string): Promise<boolean> {
        const findUserAfterDelete = await this.dataSource.query(`SELECT id, name, "websiteUrl" FROM "blog" WHERE id = $1`, [id])
        if (findUserAfterDelete.length < 1) {
            return false
        }
        else {
            await this.dataSource.query(`DELETE FROM "blog" WHERE id = $1`, [id])
            return true
        }
    }
    
    async deleteAllBlogger(): Promise<boolean> {
        await this.dataSource.query(`TRUNCATE TABLE "blog"`)
        const checkTableAfterFullClear = await this.dataSource.query(`SELECT COUNT(*) FROM "blog"`)
        if (checkTableAfterFullClear > 1) {
            return false
        }
        else {
            return true
        }

    }
}