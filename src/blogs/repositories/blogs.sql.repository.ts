import { Injectable } from "@nestjs/common"
import { InjectDataSource } from "@nestjs/typeorm"
import { BlogsType, BlogsTypeView } from "src/blogs/dto/BlogsType"
import { postSchema } from "src/db";
import { LIKES } from "src/utils/types";
import { DataSource } from "typeorm"


@Injectable()
export class BlogsRepositorySql {

    constructor(@InjectDataSource() protected dataSource: DataSource) {

    }

    async getAllBlogs(
        offset: number,
        limit: number = 10,
        searchNameTerm?: string | null,
        pageNumber: number = 1,
        sortBy: string = 'created_at',
        sortDirection: string = 'desc'
    ): Promise<object> {

// Базовый SQL-запрос и дополнительные параметры
const searchCondition = searchNameTerm ? `WHERE name ILIKE $1` : '';
const queryParams = searchNameTerm ? [`%${searchNameTerm}%`, limit, offset] : [limit, offset];

// Запрос для общего количества блогов с учетом условия поиска
const [totalCountResult] = await this.dataSource.query(
    `
    SELECT COUNT(*)::int AS count 
    FROM "blog" 
    ${searchCondition}
    `,
    searchNameTerm ? [`%${searchNameTerm}%`] : []
);
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

//---------------------------------------------------------------------------


async allPostsSpecificBlogger(
    blogId: string, 
    offset: number = 0, 
    limit: number = 10, 
    pageNumber: number = 1, 
    sortBy: string = 'created_at',
    sortDirection: string = 'desc'
): Promise<object | null> {
    // Объект для сопоставления значений сортировки с фактическими именами столбцов
    const sortFieldMap = {
        title: 'title',
        created_at: 'created_at',
        blog_id: 'blog_id',
        blogName: 'blog_name'
    };

    // Список допустимых направлений сортировки
    const allowedSortDirections = ['asc', 'desc'];

    // Проверка значений sortBy и sortDirection
    const sortField = sortFieldMap[sortBy] || 'created_at';
    const order = allowedSortDirections.includes(sortDirection.toLowerCase()) ? sortDirection.toUpperCase() : 'DESC';

    // Проверка существования блога
    const checkBloggerExist = await this.dataSource.query(`SELECT COUNT(*)::int as count FROM "blog" WHERE id = $1`, [blogId]);
    if (checkBloggerExist[0].count < 1) {
        return null; 
    }

    // Получаем общее количество постов для данного блога
    const [{ count: totalCount }] = await this.dataSource.query(`SELECT COUNT(*)::int AS count FROM "posts" WHERE blog_id = $1`, [blogId]);
    const pagesCount = Math.ceil(totalCount / limit);

    // Основной запрос на получение постов с лайками и дизлайками
    const getAllPosts = await this.dataSource.query(
        `
        SELECT 
            p.id,
            p.title,
            p.short_description AS "shortDescription",
            p.content,
            p.blog_id AS "blogId",
            p.blog_name AS "blogName",
            p.created_at AS "createdAt",
            COALESCE(pl.likes_count, 0) AS "likesCount",
            COALESCE(pd.dislikes_count, 0) AS "dislikesCount",
            'None' AS "myStatus",  -- всегда "None" так как userId не передается
            COALESCE(latest_likes.likes, '[]'::json) AS "newestLikes" -- Получаем последние лайки
        FROM "posts" p
        LEFT JOIN (
            SELECT 
                post_id,
                COUNT(*) AS likes_count
            FROM "posts_like_storage"
            GROUP BY post_id
        ) pl ON p.id = pl.post_id
        LEFT JOIN (
            SELECT 
                post_id,
                COUNT(*) AS dislikes_count
            FROM "posts_dislike_storage"
            GROUP BY post_id
        ) pd ON p.id = pd.post_id
        LEFT JOIN (
            SELECT 
                post_id,
                json_agg(json_build_object('addedAt', added_at, 'userId', user_id, 'login', user_login) 
                ORDER BY added_at DESC) AS likes
            FROM "posts_like_storage"
            GROUP BY post_id
        ) latest_likes ON p.id = latest_likes.post_id
        WHERE p.blog_id = $1
        ORDER BY ${sortField} ${order}
        LIMIT $2 OFFSET $3
        `,
        [blogId, limit, offset]
    );

    // Форматируем вывод
    return {
        pagesCount,
        page: pageNumber,
        pageSize: limit,
        totalCount,
        items: getAllPosts.map(post => ({
            id: post.id.toString(),
            title: post.title,
            shortDescription: post.shortDescription,
            content: post.content,
            blogId: post.blogId.toString(),
            blogName: post.blogName,
            createdAt: post.createdAt,
            extendedLikesInfo: {
                likesCount: Number(post.likesCount),
                dislikesCount: Number(post.dislikesCount),
                myStatus: post.myStatus, // всегда "None"
                newestLikes: post.newestLikes.slice(0, 3) // последние 3 лайка
            },
        }))
    };
}


    // Возвращаем блог для внешних ресурсов, VIEW версия
    async targetBlog(id: string, userId?: string): Promise<BlogsTypeView | null> {


        try {
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
                return null
            }
        } catch (error) {
            return null
        }


    }

        // Возвращаем блог для внутренних запросов, FULL ADMIN версия
        async targetBlogAdmin(id: string, userId?: string): Promise<BlogsType | null> {


            try {
                const [blog] = await this.dataSource.query(
                    `
                SELECT * 
                FROM "blog" WHERE id = $1
                    `, [id])
                if (blog !== null) {
                    return blog
                }
                else {
                    return null
                }
            } catch (error) {
                return null
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
        const findUserAfterDelete = await this.dataSource.query(`SELECT id, name, website_url FROM "blog" WHERE id = $1`, [id])
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