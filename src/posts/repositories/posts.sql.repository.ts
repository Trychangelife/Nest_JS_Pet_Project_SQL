import { Injectable, Next } from "@nestjs/common"
import { InjectDataSource } from "@nestjs/typeorm"
import { BlogsType } from "src/blogs/dto/BlogsType"
import { Comments } from "src/comments/dto/CommentsClass"
import { CommentsType, CommentsTypeView } from "src/comments/dto/CommentsType"
import { PostsType, PostsTypeView } from "src/posts/dto/PostsType"
import { LIKES } from "src/utils/types"
import { post } from "typegoose"
import { DataSource } from "typeorm"

export const postViewModel = {
    _id: 0,
    id: 1,
    title: 1,
    shortDescription: 1,
    content: 1,
    bloggerId: 1,
    bloggerName: 1,
    addedAt: 1,
    extendedLikesInfo: 1,
}

export const commentsVievModel = {
    _id: 0,
    postId: 0,
    __v: 0,
    likeStorage: 0,
    dislikeStorage: 0
}

@Injectable()
export class PostsRepositorySql {

    constructor(@InjectDataSource() protected dataSource: DataSource) {

    }
    async allPosts(skip: number, limit: number, page?: number, userId?: string): Promise<object> {
        const totalCount = await this.dataSource.query(`SELECT COUNT (*) FROM "Posts"`)
        const keys = Object.keys(totalCount)
        const pagesCount = Math.ceil(totalCount[keys[0]].count / limit)
        const getAllPosts = await this.dataSource.query(`SELECT * FROM "Posts" ORDER BY id LIMIT $1 OFFSET $2`, [limit, skip])
        return { pagesCount: pagesCount, page: page, pageSize: limit, totalCount: parseInt(totalCount[keys[0]].count), items: getAllPosts }
    }
    //     const totalCount = await this.postsModel.count({})
    //     const pagesCount = Math.ceil(totalCount / limit)
    //     const cursor = await this.postsModel.find({}, postViewModel).skip(skip).limit(limit)
    //     const arrayForReturn = []
    //     const targetPostWithAggregation = await this.postsModel.aggregate([{
    //         $project: {_id: 0 ,id: 1, title: 1, shortDescription: 1, content: 1, bloggerId: 1, bloggerName: 1, addedAt: 1, extendedLikesInfo: {likesCount: 1, dislikesCount: 1, myStatus: 1, newestLikes: {addedAt: 1, userId: 1, login: 1}}}}
    //     ])
    //     for (let index = 0; index < targetPostWithAggregation.length; index++) {
    //         let post = {...targetPostWithAggregation[index], extendedLikesInfo: {...targetPostWithAggregation[index].extendedLikesInfo, newestLikes: targetPostWithAggregation[index].extendedLikesInfo.newestLikes.reverse().slice(0,3)
    //         }};
    //         const checkOnDislike = await this.postsModel.findOne({$and: [{id: post.id}, {"dislikeStorage.userId": userId}]}).lean()
    //         const checkOnLike = await this.postsModel.findOne({$and: [{id: post.id}, {"extendedLikesInfo.newestLikes.userId": userId}]}).lean()
    //         let myStatus = ''
    //          if (checkOnLike) {
    //         myStatus = "Like"
    //     }
    //             else if (checkOnDislike) {
    //         myStatus = "Dislike"
    //     }
    //             else {
    //         myStatus = "None"
    //     }
    //         post.extendedLikesInfo.myStatus = myStatus
    //         arrayForReturn.push(post)
    //     }    
    //     return { pagesCount: pagesCount, page: page, pageSize: limit, totalCount: totalCount, items: arrayForReturn }
    // }


    // async targetPosts(postId: string, userId?: string): Promise<object | undefined> {
    //     const targetPost: PostsType | null = await this.postsModel.findOne({ id: postId }, postViewModel)
    //     const checkOnDislike = (await this.postsModel.findOne({$and: [{id: postId}, {"dislikeStorage.userId": userId}]}).lean())
    //     const checkOnLike = (await this.postsModel.findOne({$and: [{id: postId}, {"extendedLikesInfo.newestLikes.userId": userId}]}).lean())
    //     let myStatus = ''
    //     if (checkOnLike) {
    //         myStatus = "Like"
    //     }
    //     else if (checkOnDislike) {
    //         myStatus = "Dislike"
    //     }
    //     else {
    //         myStatus = "None"
    //     }

    //     const targetPostWithAggregation = await this.postsModel.aggregate([{
    //         $project: {_id: 0 ,id: 1, title: 1, shortDescription: 1, content: 1, bloggerId: 1, bloggerName: 1, addedAt: 1, extendedLikesInfo: {likesCount: 1, dislikesCount: 1, myStatus: myStatus, newestLikes: {addedAt: 1, userId: 1, login: 1}}}
    //     }
    //     ]).match({id: postId})
    //     if (targetPostWithAggregation == null) {
    //         return undefined
    //     }
    //     else {
    //         return {...targetPostWithAggregation[0], extendedLikesInfo: {...targetPostWithAggregation[0].extendedLikesInfo, newestLikes: targetPostWithAggregation[0].extendedLikesInfo.newestLikes.reverse().slice(0,3)
    //             //.sort((a,b) => a.addedAt.getTime() - b.addedAt.getTime())
    //         }}; 
    //         try {

    //         } finally {
    //             return targetPostWithAggregation[0]
    //         }

    //     }
    // }


    async releasePost(newPosts: PostsType, foundBlog: BlogsType): Promise<PostsTypeView | null> {

        const postAfterCreated: PostsType = await this.dataSource.query(`
    INSERT INTO "posts" (title, "short_description", content, "blog_id", "blog_name", "created_at", "author_user_id")
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
    `, [newPosts.title, newPosts.shortDescription, newPosts.content, foundBlog.id, foundBlog.name, newPosts.createdAt, foundBlog.owner_user_id])


        const postViewModel: PostsTypeView = {
            id: postAfterCreated[0].id.toString(),
            title: postAfterCreated[0].title,
            shortDescription: postAfterCreated[0].short_description,
            content: postAfterCreated[0].content,
            blogId: postAfterCreated[0].blog_id.toString(),
            blogName: postAfterCreated[0].blog_name,
            createdAt: postAfterCreated[0].created_at,
            extendedLikesInfo: {
                likesCount: 0,
                dislikesCount: 0,
                myStatus: LIKES.NONE,
                newestLikes: []
            }
        }
        if (postAfterCreated !== null) {
            return postViewModel
        }
        else {
            return null
        }
    }


    async changePost(
        postId: string,
        title: string,
        shortDescription: string,
        content: string,
        blogId: string
    ): Promise<boolean | null> {

        const [existingBlog] = await this.dataSource.query(
            `
        SELECT posts.*, blog.*
        FROM "posts"
        JOIN "blog" ON posts.blog_id = blog.id
        WHERE posts.id = $1 AND blog_id = $2
        `, [postId, blogId]
        );

        if (!existingBlog) {
            // Если пост с указанным id не найден, возвращаем false
            return false;
        }

        // Выполняем обновление, если объект найден
        const [updatedPost] = await this.dataSource.query(
            `
        UPDATE "posts"
        SET title = $2, short_description = $3, content = $4
        WHERE id = $1
        RETURNING *
        `,
            [postId, title, shortDescription, content]
        );

        // Проверяем, что обновление действительно произошло
        if (!updatedPost) {
            // Если `updatedPost` пустой, значит, обновление не было выполнено
            return false;
        }

        return true;  // Возвращаем `true`, если изменения были успешно применены
    }

    async targetPost(postId: string, userId?: string): Promise<PostsTypeView | null> {


        try {
            const [post] = await this.dataSource.query(
                `
        SELECT * 
        FROM "posts" WHERE id = $1
            `, [postId])
            if (post !== null) {
                const postViewModel: PostsTypeView = {
                    id: post.id.toString(),
                    title: post.title,
                    shortDescription: post.short_description,
                    content: post.content,
                    blogId: post.blog_id.toString(),
                    blogName: post.blog_name,
                    createdAt: post.created_at,
                    extendedLikesInfo: {
                        likesCount: 0,
                        dislikesCount: 0,
                        myStatus: LIKES.NONE,
                        newestLikes: []
                    }
                }
                return postViewModel
            }
            else {
                return null
            }
        } catch (error) {
            return null
        }


    }

    async deletePost(deletePostId: string, blogId: string): Promise<boolean> {
        const findPostBeforeDelete = await this.dataSource.query(`SELECT * FROM "posts" WHERE id = $1 AND blog_id = $2`, [deletePostId, blogId])
        if (findPostBeforeDelete.length < 1) {
            return false
        }
        else {
            await this.dataSource.query(`DELETE FROM "posts" WHERE id = $1 AND blog_id = $2`, [deletePostId, blogId])
            return true
        }
    }
    async createCommentForSpecificPost(createdComment: CommentsType): Promise<CommentsTypeView | boolean> {

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
            id: commentAfterCreated[0].id.toString(),
            content: commentAfterCreated[0].content,
            commentatorInfo: {
                userId: commentAfterCreated[0].author_user_id.toString(),
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


        // const foundNewPost: CommentsType = await this.commentsModel.findOne({id: createdComment.id}, commentsVievModel).lean()
        // if (foundNewPost !== null) {
        // return foundNewPost}
        // else {return false}
    }
    async takeCommentByIdPost(
        postId: string,
        offset: number,
        limit: number = 10,
        pageNumber: number = 1,
        sortBy: string = 'created_at',
        sortDirection: string = 'desc'): Promise<object | boolean> {

        // Объект для сопоставления значений сортировки с фактическими именами столбцов
        const sortFieldMap = {
            userId: 'title',
            created_at: 'created_at',
            blog_id: 'blog_id',
            blogName: 'blog_name'  // "blogName" -> "blog_name"
        };

        const allowedSortDirections = ['asc', 'desc'];
        const sortField = sortFieldMap[sortBy] || 'created_at';


        const [totalCountResult] = await this.dataSource.query(`SELECT COUNT(*)::int AS count FROM "comments" WHERE post_id = $1`, [postId]);
        const totalCount = parseInt(totalCountResult.count, 10);
        const pagesCount = Math.ceil(totalCount / limit);
        const queryParams = [limit, offset, postId];

        const getAllComments = await this.dataSource.query(
            `
            SELECT * 
            FROM "comments"
            WHERE post_id = $${queryParams.length}
            ORDER BY ${sortBy} ${sortDirection}
            LIMIT $${queryParams.length - 2} OFFSET $${queryParams.length - 1}
            `,
            queryParams
        );

        // Возвращаем форматированный объект

        return {
            pagesCount,
            page: pageNumber,
            pageSize: limit,
            totalCount,
            items: getAllComments.map(e => ({
                id: e.id.toString(),
                content: e.content,
                commentatorInfo: {
                    userId: e.author_user_id.toString(),
                    userLogin: e.author_login_id
                },
                createdAt: e.created_at,
                likesInfo: {
                    likesCount: 0,
                    dislikesCount: 0,
                    myStatus: LIKES.NONE,
                    newestLikes: []
                },
            }))
        };

        // if (findPosts !== null) {
        // const findComments = await this.commentsModel.find({postId: postId}, commentsVievModel).skip(skip).limit(limit).lean()
        // const commentsWithAggregation = await this.commentsModel.aggregate([{
        //     $project: {_id: 0 ,id: 1, content: 1, userId: 1, userLogin: 1, addedAt: 1, postId: 1, likesInfo: 1}}
        // ]).match({postId: postId})
        // const arrayForReturn = []
        // for (let index = 0; index < commentsWithAggregation.length; index++) {

        //     // {...targetPostWithAggregation[0], extendedLikesInfo: {...targetPostWithAggregation[0].extendedLikesInfo, newestLikes: targetPostWithAggregation[0].extendedLikesInfo.newestLikes.reverse().slice(0,3)
        //     // }}; 

        //     let comment = {...commentsWithAggregation[index], likesInfo: {...commentsWithAggregation[index].likesInfo
        //          }};
        //     const checkOnDislike = await this.commentsModel.findOne({$and: [{id: comment.id}, {"dislikeStorage.userId": userId}]}).lean()
        //     const checkOnLike = await this.commentsModel.findOne({$and: [{id: comment.id}, {"likeStorage.userId": userId}]}).lean()
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
        // comment.likesInfo.myStatus = myStatus
        // delete comment.postId
        //     arrayForReturn.push(comment)
        // }
        // return { pagesCount: pagesCount, page: page, pageSize: limit, totalCount: totalCount, items: arrayForReturn }}
        // else { return false}
    }


    async like_Dislike(
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
            const likesCountPlusLike = post.likes_count + 1;
            const likesCountMinusLike = post.likes_count - 1;
            const dislikesCountPlusLike = post.dislikes_count + 1;
            const dislikesCountMinusDislike = post.dislikes_count - 1;

            // LIKE статус
            if (likeStatus === "Like") {
                const checkOnLike = await queryRunner.query(
                    `SELECT * FROM posts_like_storage WHERE user_id = $1 AND post_id = $2`,
                    [userId, postId]
                );
                const checkOnDislike = await queryRunner.query(
                    `SELECT * FROM posts_dislike_storage WHERE user_id = $1 AND post_id = $2`,
                    [userId, postId]
                );

                if (checkOnDislike.length > 0) {
                    await queryRunner.query(
                        `UPDATE posts SET dislikes_count = $1 WHERE id = $2`,
                        [dislikesCountMinusDislike, postId]
                    );
                    await queryRunner.query(
                        `DELETE FROM posts_dislike_storage WHERE user_id = $1 AND post_id = $2`,
                        [userId, postId]
                    );
                }

                if (checkOnLike.length === 0) {
                    await queryRunner.query(
                        `UPDATE posts SET likes_count = $1 WHERE id = $2`,
                        [likesCountPlusLike, postId]
                    );
                    await queryRunner.query(
                        `INSERT INTO posts_like_storage (added_at, user_id, user_login, post_id) VALUES ($1, $2, $3, $4)`,
                        [new Date(), userId, login, postId]
                    );
                }
                return post;
            }

            // DISLIKE статус
            if (likeStatus === "Dislike") {
                const checkOnDislike = await queryRunner.query(
                    `SELECT * FROM posts_dislike_storage WHERE user_id = $1 AND post_id = $2`,
                    [userId, postId]
                );
                const checkOnLike = await queryRunner.query(
                    `SELECT * FROM posts_like_storage WHERE user_id = $1 AND post_id = $2`,
                    [userId, postId]
                );

                if (checkOnLike.length > 0) {
                    await queryRunner.query(
                        `UPDATE posts SET likes_count = $1 WHERE id = $2`,
                        [likesCountMinusLike, postId]
                    );
                    await queryRunner.query(
                        `DELETE FROM posts_like_storage WHERE user_id = $1 AND post_id = $2`,
                        [userId, postId]
                    );
                }

                if (checkOnDislike.length === 0) {
                    await queryRunner.query(
                        `UPDATE posts SET dislikes_count = $1 WHERE id = $2`,
                        [dislikesCountPlusLike, postId]
                    );
                    await queryRunner.query(
                        `INSERT INTO posts_dislike_storage (added_at, user_id, user_login, post_id) VALUES ($1, $2, $3, $4)`,
                        [new Date(), userId, login, postId]
                    );
                }
                return post;
            }

            // NONE статус
            if (likeStatus === "None") {
                const checkOnDislike = await queryRunner.query(
                    `SELECT * FROM posts_dislike_storage WHERE user_id = $1 AND post_id = $2`,
                    [userId, postId]
                );
                const checkOnLike = await queryRunner.query(
                    `SELECT * FROM posts_like_storage WHERE user_id = $1 AND post_id = $2`,
                    [userId, postId]
                );

                if (checkOnLike.length > 0) {
                    await queryRunner.query(
                        `UPDATE posts SET likes_count = $1 WHERE id = $2`,
                        [likesCountMinusLike, postId]
                    );
                    await queryRunner.query(
                        `DELETE FROM posts_like_storage WHERE user_id = $1 AND post_id = $2`,
                        [userId, postId]
                    );
                }
                if (checkOnDislike.length > 0) {
                    await queryRunner.query(
                        `UPDATE posts SET dislikes_count = $1 WHERE id = $2`,
                        [dislikesCountMinusDislike, postId]
                    );
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
            await queryRunner.release();
        }
    }

}