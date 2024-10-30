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

//---------------------------------------------------------------------------


    async allPostsSpecificBlogger(
        blogId: string, 
        offset: number = 0, 
        limit: number = 10, 
        pageNumber: number = 1, 
        sortBy: string = 'created_at',
        sortDirection: string = 'desc'
        ): Promise<object | null> {
    // Список разрешённых полей для сортировки и направлений сортировки
    const allowedSortFields = ['title', 'created_at', 'blog_id'];
    const allowedSortDirections = ['asc', 'desc'];

    // Проверка значений sortBy и sortDirection
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'created_at';
    const order = allowedSortDirections.includes(sortDirection.toLowerCase()) ? sortDirection.toUpperCase() : 'DESC';

    if (blogId == undefined) {
        const [totalCountResult] = await this.dataSource.query(`SELECT COUNT(*)::int AS count FROM "posts"`);
        const totalCount = parseInt(totalCountResult.count, 10);
        const pagesCount = Math.ceil(totalCount / limit);

        // Конструируем запрос с интерполяцией для значений сортировки
        const getAllPosts = await this.dataSource.query(
            `
            SELECT * 
            FROM "posts"
            ORDER BY ${sortField} ${order}
            LIMIT $1 OFFSET $2
            `,
            [limit, offset]
        );
        // Возвращаем форматированный объект
        return {
            pagesCount,
            page: pageNumber,
            pageSize: limit,
            totalCount,
            items: getAllPosts.map(post => ({
                id: post.id.toString(),
                title: post.title,
                shortDescription: post.short_description,
                content: post.content,
                blogId: post.blog_id.toString(),
                blogName: post.blog_name,
                createdAt: post.created_at,
                extendedLikesInfo:{
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: LIKES.NONE,
                    newestLikes: []
                },
            }))
        };   
        }
        // РАСШИРЕННЫЙ МЕТОД С УЧАСТИЕМ BLOG ID 
        const [totalCountResult] = await this.dataSource.query(`SELECT COUNT(*)::int AS count FROM "posts" WHERE blog_id = $1`, [blogId]);
        const totalCount = parseInt(totalCountResult.count, 10);
        const pagesCount = Math.ceil(totalCount / limit);
        const queryParams =  [limit, offset, blogId];
        const checkBloggerExist = await this.dataSource.query(`SELECT COUNT(*)::int as count FROM "blog" WHERE id = $1 `,[blogId])
        if (checkBloggerExist < 1) { return null }

            const getAllPosts = await this.dataSource.query(
                `
                SELECT * 
                FROM "posts"
                WHERE blog_id = $${queryParams.length}
                ORDER BY ${sortBy} ${sortDirection}
                LIMIT $${queryParams.length - 2} OFFSET $${queryParams.length - 1}
                `,
                queryParams
            );
                console.log(queryParams)
            // Возвращаем форматированный объект
            return {
                pagesCount,
                page: pageNumber,
                pageSize: limit,
                totalCount,
                items: getAllPosts.map(post => ({
                    id: post.id.toString(),
                    title: post.title,
                    shortDescription: post.short_description,
                    content: post.content,
                    blogId: post.blog_id.toString(),
                    blogName: post.blog_name,
                    createdAt: post.created_at,
                    extendedLikesInfo:{
                        likesCount: 0,
                        dislikesCount: 0,
                        myStatus: LIKES.NONE,
                        newestLikes: []
                    },
                }))
            };   
        //     const targetPostWithAggregation = await this.postsModel.aggregate([{
        //     $project: {_id: 0 ,id: 1, title: 1, shortDescription: 1, content: 1, bloggerId: 1, bloggerName: 1, addedAt: 1, extendedLikesInfo: {likesCount: 1, dislikesCount: 1, myStatus: 1, newestLikes: {addedAt: 1, userId: 1, login: 1}}}}
        // ]).match({bloggerId: bloggerId})
        // for (let index = 0; index < targetPostWithAggregation.length; index++) {
        //     let post = {...targetPostWithAggregation[index], extendedLikesInfo: {...targetPostWithAggregation[index].extendedLikesInfo, newestLikes: targetPostWithAggregation[index].extendedLikesInfo.newestLikes.reverse().slice(0,3)
        //     }};
        //     const checkOnDislike = await this.postsModel.findOne({$and: [{id: post.id}, {"dislikeStorage.userId": userId}]}).lean()
        //     const checkOnLike = await this.postsModel.findOne({$and: [{id: post.id}, {"extendedLikesInfo.newestLikes.userId": userId}]}).lean()
        //     let myStatus = ''
        //      if (checkOnLike) {
        //     myStatus = "Like"
        // }
        //         else if (checkOnDislike) {
        //     myStatus = "Dislike"
        // }
        //         else {
        //     myStatus = "None"
        // }
        //     post.extendedLikesInfo.myStatus = myStatus
        //     arrayForReturn.push(post)
        // }
        //     if (page > 0 || pageSize > 0) {
        //         return { pagesCount, page: page, pageSize: pageSize, totalCount, items: arrayForReturn }
        //     }
        //     else {
        //         const postsBloggerWithOutPaginator = await this.postsModel.find({ bloggerId: bloggerId }).lean()
        //         return { pagesCount: 0, page: page, pageSize: pageSize, totalCount, items: postsBloggerWithOutPaginator }
        //     }
    
        // }
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