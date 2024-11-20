import { Injectable } from "@nestjs/common"
import { InjectDataSource, InjectRepository } from "@nestjs/typeorm"
import { BlogsType } from "src/blogs/dto/BlogsType"
import { CommentsType, CommentsTypeView } from "src/comments/dto/CommentsType"
import { PostEntity } from "src/entities/posts/posts.entity"
import { PostsType, PostsTypeView } from "src/posts/dto/PostsType"
import { LIKES } from "src/utils/types"
import { DataSource, Repository } from "typeorm"


@Injectable()
export class PostsRepositorySql {

    constructor(@InjectDataSource() protected dataSource: DataSource,
        @InjectRepository(PostEntity)
        private readonly postRepo: Repository<PostEntity>
    ) {

    }
    async allPosts(
        offset: number = 0,
        limit: number = 10,
        pageNumber: number = 1,
        sortBy: string = 'created_at',
        sortDirection: string = 'desc',
        userId?: number
    ): Promise<object> {

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

        // Получаем общее количество постов
        const [{ count: totalCount }] = await this.dataSource.query(`SELECT COUNT(*)::int AS count FROM "posts"`);
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
                CASE 
                        WHEN CAST($3 AS integer) IS NOT NULL AND EXISTS (
                            SELECT 1 FROM "posts_like_storage" pls 
                            WHERE pls.post_id = p.id AND pls.user_id = $3
                        ) THEN 'Like'
                        WHEN CAST($3 AS integer) IS NOT NULL AND EXISTS (
                            SELECT 1 FROM "posts_dislike_storage" pds 
                            WHERE pds.post_id = p.id AND pds.user_id = $3
                        ) THEN 'Dislike'
                        ELSE 'None'
                    END AS "myStatus",
                COALESCE(latest_likes.likes, '[]'::json) AS "newestLikes" -- Создаем как бы свою в действительности не существующую таблицу, и по POST_ID забираем все что мэтчится с лайками.
            FROM "posts" p
            LEFT JOIN ( -- ВЫЧИСЛЯЕМ КОЛ-ВО ЛАЙКОВ
                SELECT 
                    post_id,
                    COUNT(*) AS likes_count
                FROM "posts_like_storage"
                GROUP BY post_id
            ) pl ON p.id = pl.post_id
            LEFT JOIN ( -- ВЫЧИСЛЯЕМ КОЛ-ВО ДИЗЛАЙКОВ
                SELECT 
                    post_id,
                    COUNT(*) AS dislikes_count
                FROM "posts_dislike_storage"
                GROUP BY post_id
            ) pd ON p.id = pd.post_id
            LEFT JOIN (
                SELECT 
                    post_id,
                    json_agg(json_build_object('addedAt', added_at, 'userId', user_id, 'login', user_login) -- ФОРМИРУЕМ JSON для NEWESTLIKES
                    ORDER BY added_at DESC) AS likes
                FROM "posts_like_storage"
                GROUP BY post_id
            ) latest_likes ON p.id = latest_likes.post_id
            ORDER BY ${sortField} ${order}
            LIMIT $1 OFFSET $2
            `,
            [limit, offset, userId]
        );

        // Форматируем вывод
        return {
            pagesCount,
            page: pageNumber,
            pageSize: limit,
            totalCount,
            items: getAllPosts.map(post => ({
                id: post.id?.toString(),
                title: post.title,
                shortDescription: post.shortDescription,
                content: post.content,
                blogId: post.blogId?.toString(),
                blogName: post.blogName,
                createdAt: post.createdAt,
                extendedLikesInfo: {
                    likesCount: Number(post.likesCount),
                    dislikesCount: Number(post.dislikesCount),
                    myStatus: post.myStatus,
                    newestLikes: post.newestLikes.map(like => ({
                        addedAt: like.addedAt,
                        userId: like.userId?.toString(), // Конвертируем userId в строку
                        login: like.login
                    })).slice(0, 3) // последние 3 лайка
                },
            }))
        };
    }

    async releasePost(newPosts: PostsType, foundBlog: BlogsType): Promise<PostsTypeView | null> {
        // Создаем и сохраняем новый пост в базе данных
        const savedPost = await this.postRepo.save({
            title: newPosts.title,
            short_description: newPosts.shortDescription,
            content: newPosts.content,
            blog_id: foundBlog.id,
            blog_name: foundBlog.name,
            created_at: newPosts.createdAt,
            author_user_id: foundBlog.owner_user_id,
        });
        // Формируем view-модель для ответа
        const postViewModel: PostsTypeView = {
            id: savedPost.id?.toString() ?? '', // Обрабатываем возможный null
            title: savedPost.title ?? '',
            shortDescription: savedPost.short_description ?? '',
            content: savedPost.content ?? '',
            blogId: savedPost.blog_id?.toString() ?? '',
            blogName: savedPost.blog_name ?? '',
            createdAt: savedPost.created_at ?? new Date().toISOString(),
            extendedLikesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: LIKES.NONE,
                newestLikes: []
            }
        };
    
        return postViewModel;
    }
    
    async changePost(
        postId: string,
        title: string,
        shortDescription: string,
        content: string,
        blogId: string
    ): Promise<boolean> {
        // Проверяем существование поста и соответствующего блога
        const existingPost = await this.postRepo.findOne({
            where: {
                id: +postId,
                blog_id: +blogId,
            },
            relations: ['blog'], // Если нужна дополнительная информация о блоге
        });
    
        if (!existingPost) {
            // Если пост с указанным id и blog_id не найден, возвращаем false
            return false;
        }
    
        // Выполняем обновление полей
        const updateResult = await this.postRepo.update(
            { id: +postId },
            {
                title,
                short_description: shortDescription,
                content,
            }
        );
    
        // Проверяем, было ли обновлено хотя бы одно поле
        return updateResult.affected > 0;
    }

    async targetPost(postId: string, userId?: number): Promise<PostsTypeView | null> {
        try {
            // Получаем пост с дополнительной информацией о лайках и дизлайках
            const [post] = await this.dataSource.query(
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
                    CASE 
                    WHEN CAST($2 AS integer) IS NOT NULL AND EXISTS (
                        SELECT 1 FROM "posts_like_storage" pls 
                        WHERE pls.post_id = p.id AND pls.user_id = $2
                    ) THEN 'Like'
                    WHEN CAST($2 AS integer) IS NOT NULL AND EXISTS (
                        SELECT 1 FROM "posts_dislike_storage" pds 
                        WHERE pds.post_id = p.id AND pds.user_id = $2
                    ) THEN 'Dislike'
                    ELSE 'None'
                END AS "myStatus",
                    COALESCE(latest_likes.likes, '[]'::json) AS "newestLikes"
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
                    WHERE post_id = $1
                    GROUP BY post_id
                ) latest_likes ON p.id = latest_likes.post_id
                WHERE p.id = $1
                `,
                [postId, userId]
            );
            // Проверка, найден ли пост
            if (post) {
                const postViewModel: PostsTypeView = {
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
                        newestLikes: post.newestLikes.map(like => ({
                            addedAt: like.addedAt,
                            userId: like.userId.toString(), // Конвертируем userId в строку
                            login: like.login
                        })).slice(0, 3) // последние 3 лайка
                    }
                };
                return postViewModel;
            } else {
                return null;
            }
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    async deletePost(deletePostId: string, blogId: string): Promise<boolean> {
        // Проверяем существование поста с указанным `deletePostId` и `blogId`
        const existingPost = await this.postRepo.findOne({
            where: {
                id: +deletePostId,
                blog_id: +blogId,
            },
        });
    
        if (!existingPost) {
            // Если пост не найден, возвращаем false
            return false;
        }
    
        // Удаляем пост
        const deleteResult = await this.postRepo.delete({ id: +deletePostId, blog_id: +blogId });
    
        // Проверяем, было ли удалено хотя бы одно поле
        return deleteResult.affected > 0;
    }

    async createCommentForSpecificPost(createdComment: CommentsType): Promise<CommentsTypeView | boolean> {

        try {
            const commentAfterCreated = await this.dataSource.query(`
    INSERT INTO "comments" (content, "author_user_id", "author_login_id", "created_at", "post_id")
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `, [createdComment.content,
            createdComment.commentatorInfo.userId,
            createdComment.commentatorInfo.userLogin,
            createdComment.createdAt,
            createdComment.postId,])


            const commentViewModel: CommentsTypeView = {
                id: commentAfterCreated[0].id?.toString(),
                content: commentAfterCreated[0].content,
                commentatorInfo: {
                    userId: commentAfterCreated[0].author_user_id?.toString(),
                    userLogin: commentAfterCreated[0].author_login_id
                },
                createdAt: commentAfterCreated[0].created_at,
                likesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: LIKES.NONE,
                }
            }
            if (commentViewModel !== null) {
                return commentViewModel
            }
            else {
                return null
            }
        } catch (error) {
            return null
        }


    }

    async takeCommentByIdPost(
        postId: string,
        offset: number = 0,
        limit: number = 10,
        pageNumber: number = 1,
        sortBy: string = 'created_at',
        sortDirection: string = 'desc',
        userId?: number,
    ): Promise<object | boolean> {

        // Объект для сопоставления значений сортировки с фактическими именами столбцов
        const sortFieldMap = {
            userId: 'author_user_id',
            created_at: 'created_at',
            blog_id: 'blog_id',
            blogName: 'blog_name'
        };

        const allowedSortDirections = ['asc', 'desc'];
        const sortField = sortFieldMap[sortBy] || 'created_at';
        const order = allowedSortDirections.includes(sortDirection.toLowerCase()) ? sortDirection.toUpperCase() : 'DESC';

        // Получаем общее количество комментариев для поста
        const [totalCountResult] = await this.dataSource.query(
            `SELECT COUNT(*)::int AS count FROM "comments" WHERE post_id = $1`, [postId]
        );
        const totalCount = parseInt(totalCountResult.count, 10);
        const pagesCount = Math.ceil(totalCount / limit);

        // Основной запрос для получения комментариев
        const getAllComments = await this.dataSource.query(
            `
            SELECT 
                c.id,
                c.content,
                c.author_user_id AS "userId",
                c.author_login_id AS "userLogin",
                c.created_at AS "createdAt",
                COALESCE(cl.likes_count, 0) AS "likesCount",
                COALESCE(cd.dislikes_count, 0) AS "dislikesCount",
                CASE 
                WHEN CAST($4 AS integer) IS NOT NULL AND EXISTS (
                    SELECT 1 FROM "comments_like_storage" cls 
                    WHERE cls.comment_id = c.id AND cls.user_id = $4
                ) THEN 'Like'
                WHEN CAST($4 AS integer) IS NOT NULL AND EXISTS (
                    SELECT 1 FROM "comments_dislike_storage" cds 
                    WHERE cds.comment_id = c.id AND cds.user_id = $4
                ) THEN 'Dislike'
                ELSE 'None'
                END AS "myStatus"
            FROM "comments" c
            LEFT JOIN ( -- Вычисляем кол-во лайков
                SELECT 
                    comment_id,
                    COUNT(*) AS likes_count
                FROM "comments_like_storage"
                GROUP BY comment_id
            ) cl ON c.id = cl.comment_id
            LEFT JOIN ( -- Вычисляем кол-во дизлайков
                SELECT 
                    comment_id,
                    COUNT(*) AS dislikes_count
                FROM "comments_dislike_storage"
                GROUP BY comment_id
            ) cd ON c.id = cd.comment_id
            WHERE c.post_id = $3
            ORDER BY ${sortField} ${order}
            LIMIT $1 OFFSET $2
            `,
            [limit, offset, postId, userId]
        );

        if (getAllComments.length === 0) {
            return false
        }

        // Возвращаем форматированный объект
        return {
            pagesCount,
            page: pageNumber,
            pageSize: limit,
            totalCount,
            items: getAllComments.map(e => ({
                id: e.id?.toString(),
                content: e.content,
                commentatorInfo: {
                    userId: e.userId?.toString(),
                    userLogin: e.userLogin
                },
                createdAt: e.createdAt,
                likesInfo: {
                    likesCount: Number(e.likesCount),
                    dislikesCount: Number(e.dislikesCount),
                    myStatus: e.myStatus // Всегда "None" для обезличенных запросов
                },
            }))
        };
    }




    async likeDislikeForPost(
        postId: string,
        likeStatus: LIKES,
        userId: string,
        login: string
    ): Promise<string | object> {


        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
        try {
            // Поиск поста и пользователя
            const foundPost = await queryRunner.query(
                `SELECT * FROM posts WHERE id = $1`,
                [postId]
            );
            const foundUser = await queryRunner.query(
                `SELECT * FROM users WHERE id = $1`,
                [userId]
            );

            if (!foundPost[0] || !foundUser[0]) {
                return foundUser ? '404' : '400';
            }

            const post = foundPost[0];
            // const likesCountPlusLike = post.likes_count + 1;
            // const likesCountMinusLike = post.likes_count - 1;
            // const dislikesCountPlusLike = post.dislikes_count + 1;
            // const dislikesCountMinusDislike = post.dislikes_count - 1;

            const checkOnLike = await queryRunner.query(
                `SELECT * FROM posts_like_storage WHERE user_id = $1 AND post_id = $2`,
                [userId, postId]
            );

            const checkOnDislike = await queryRunner.query(
                `SELECT * FROM posts_dislike_storage WHERE user_id = $1 AND post_id = $2`,
                [userId, postId]
            );

            // LIKE статус
            if (likeStatus === "Like") {

                if (checkOnDislike.length > 0) {
                    // Удаляем дизлайк
                    await queryRunner.query(
                        `DELETE FROM posts_dislike_storage WHERE user_id = $1 AND post_id = $2`,
                        [userId, postId]
                    );
                }
                if (checkOnLike.length === 0) {
                    // Добавляем лайк
                    await queryRunner.query(
                        `INSERT INTO posts_like_storage (added_at, user_id, user_login, post_id) VALUES ($1, $2, $3, $4)`,
                        [new Date(), userId, login, postId]
                    );
                }

                return post;
            }

            // DISLIKE статус
            if (likeStatus === "Dislike") {

                if (checkOnLike.length > 0) {
                    // Удаляем дизлайк
                    await queryRunner.query(
                        `DELETE FROM posts_like_storage WHERE user_id = $1 AND post_id = $2`,
                        [userId, postId]
                    );
                }
                if (checkOnDislike.length === 0) {
                    // Добавляем лайк
                    await queryRunner.query(
                        `INSERT INTO posts_dislike_storage (added_at, user_id, user_login, post_id) VALUES ($1, $2, $3, $4)`,
                        [new Date(), userId, login, postId]
                    );

                }
                return post;
            }

            // NONE статус
            if (likeStatus === "None") {

                if (checkOnLike.length > 0) {
                    await queryRunner.query(
                        `DELETE FROM posts_like_storage WHERE user_id = $1 AND post_id = $2`,
                        [userId, postId]
                    );
                }
                if (checkOnDislike.length > 0) {
                    await queryRunner.query(
                        `DELETE FROM posts_dislike_storage WHERE user_id = $1 AND post_id = $2`,
                        [userId, postId]
                    );
                }
                return post;
            }

            return "404";
        } catch (error) {
            return "404";
        }
        finally {
            await queryRunner.commitTransaction()
            await queryRunner.release();
        }
    }

}