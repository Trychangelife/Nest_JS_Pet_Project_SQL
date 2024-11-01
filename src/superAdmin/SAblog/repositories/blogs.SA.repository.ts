import { Injectable } from "@nestjs/common"
import { InjectDataSource } from "@nestjs/typeorm"
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

}