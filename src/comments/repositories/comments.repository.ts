import { Injectable } from "@nestjs/common"
import { InjectDataSource } from "@nestjs/typeorm"
import { CommentsTypeView } from "src/comments/dto/CommentsType"
import { LIKES } from "src/utils/types"
import { DataSource } from "typeorm"

@Injectable()
export class CommentsRepository {

    constructor (
        @InjectDataSource() protected dataSource: DataSource
    ) {

    }
    async commentsById(commentId: string, userId?: string): Promise<CommentsTypeView | null> {
        try {
            // Основной запрос для получения комментария с лайками и дизлайками
            const [comment] = await this.dataSource.query(
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
                        WHEN CAST($2 AS integer) IS NOT NULL AND EXISTS (
                            SELECT 1 FROM "comments_like_storage" cls 
                            WHERE cls.comment_id = c.id AND cls.user_id = $2
                        ) THEN 'Like'
                        WHEN CAST($2 AS integer) IS NOT NULL AND EXISTS (
                            SELECT 1 FROM "comments_dislike_storage" cds 
                            WHERE cds.comment_id = c.id AND cds.user_id = $2
                        ) THEN 'Dislike'
                        ELSE 'None'
                    END AS "myStatus"
                FROM "comments" c
                LEFT JOIN ( -- Подсчет количества лайков
                    SELECT 
                        comment_id,
                        COUNT(*) AS likes_count
                    FROM "comments_like_storage"
                    GROUP BY comment_id
                ) cl ON c.id = cl.comment_id
                LEFT JOIN ( -- Подсчет количества дизлайков
                    SELECT 
                        comment_id,
                        COUNT(*) AS dislikes_count
                    FROM "comments_dislike_storage"
                    GROUP BY comment_id
                ) cd ON c.id = cd.comment_id
                WHERE c.id = $1
                `,
                [commentId, userId]
            );
    
            if (!comment) {
                return null;
            }
    
            // Формируем объект ответа
            const resultView: CommentsTypeView = {
                id: comment.id.toString(),
                content: comment.content,
                commentatorInfo: {
                    userId: comment.userId.toString(),
                    userLogin: comment.userLogin
                },
                createdAt: comment.createdAt,
                likesInfo: {
                    likesCount: Number(comment.likesCount),
                    dislikesCount: Number(comment.dislikesCount),
                    myStatus: comment.myStatus
                }
            };
            return resultView;
        } catch (error) {
            console.error('Error fetching comment by ID:', error);
            return null;
        }
    }
    
    
    
    // async commentsByUserId(commentId: string, userId?: string): Promise<CommentsType | null> {
    //     const result = await this.commentsModel.findOne({ id: commentId }, commentsVievModel )
    //     const checkOnDislike = (await this.commentsModel.findOne({$and: [{id: commentId}, {"dislikeStorage.userId": userId}]}).lean())
    //     const checkOnLike = (await this.commentsModel.findOne({$and: [{id: commentId}, {"likeStorage.userId": userId}]}).lean())
    //     let myStatus = ''
    // if (checkOnLike) {
    //     myStatus = "Like"
    // }
    // else if (checkOnDislike) {
    //     myStatus = "Dislike"
    // }
    // else {
    //     myStatus = "None"
    // }
    // const targetCommentWithAggregation = await this.commentsModel.aggregate([{
    //     $project: {_id: 0 ,id: 1, content: 1, commentatorInfo: {userId: 1, userLogin: 1}, createdAt: 1, likesInfo: {likesCount: 1, dislikesCount: 1, myStatus: myStatus}}}
    // ]).match({id: commentId})
    // if (targetCommentWithAggregation == null) {
    //     return null
    // }
    // else {
    //     return targetCommentWithAggregation[0]; 
    // }
        
    // }
    async updateCommentByCommentId(commentId: string, content: string, userId: string): Promise<boolean | null> {

        try {
            const [comment] = await this.dataSource.query(
                `
            SELECT * 
            FROM "comments" WHERE id = $1
                `, [commentId])
            if (comment !== null && comment?.author_user_id === userId) {
                const updatedComment = await this.dataSource.query(
                    `
                    UPDATE "comments"
                    SET content = $2
                    WHERE id = $1
                    RETURNING *
                    `,
                    [commentId, content]
                );
        
                return updatedComment.length > 0;
            }
            if (comment == null) {
                return null
            }
            else {
                return false
            }
        } catch (error) {
            console.log(error)
            return null
        }

    }
    async deleteCommentByCommentId(commentId: string, userId: string): Promise<boolean | null> {


        try {
            const [comment] = await this.dataSource.query(
                `
            SELECT * 
            FROM "comments" WHERE id = $1
                `, [commentId])
            if (commentId !== null && comment.author_user_id === userId) {
                await this.dataSource.query(`DELETE FROM "comments" WHERE id = $1`, [commentId])
                return true
            }
            if (comment == null) {
                return null
            }
            else {
                return false
            }
        } catch (error) {
            console.log(error)
            return null
        }
        
    }
    async like_dislike(
        commentId: string, 
        likeStatus: LIKES, 
        userId: string, 
        login: string
    ): Promise<string | object> {
        
        const queryRunner = this.dataSource.createQueryRunner();
        await queryRunner.connect();
        await queryRunner.startTransaction();
    
        try {
            // Проверяем, существует ли комментарий и пользователь
            const foundComment = await queryRunner.query(
                `SELECT * FROM comments WHERE id = $1`, [commentId]
            );
    
            const foundUser = await queryRunner.query(
                `SELECT * FROM users WHERE id = $1`, [userId]
            );
    
            if (!foundComment.length || !foundUser.length) {
                return foundUser.length ? '404' : '400';
            }
    
            const comment = foundComment[0];
            const currentLikeStatus = likeStatus[Object.keys(likeStatus)[0]];

            const checkOnDislike = await queryRunner.query(
                `SELECT * FROM comments_dislike_storage WHERE user_id = $1 AND comment_id = $2`, 
                [userId, commentId]
            );

            const checkOnLike = await queryRunner.query(
                `SELECT * FROM comments_like_storage WHERE user_id = $1 AND comment_id = $2`, 
                [userId, commentId]
            );
            // LIKE статус
            if (likeStatus === "Like") {

                if (checkOnDislike.length > 0) {
                    // Удаляем дизлайк
                    await queryRunner.query(
                        `DELETE FROM comments_dislike_storage WHERE user_id = $1 AND comment_id = $2`,
                        [userId, commentId]
                    );
                }
                if (checkOnLike.length === 0) {
                    // Добавляем лайк
                    await queryRunner.query(
                        `INSERT INTO comments_like_storage (added_at, user_id, user_login, comment_id) VALUES ($1, $2, $3, $4)`,
                        [new Date(), userId, login, commentId]
                    );
                }

                return comment;
            }

            // DISLIKE статус
            if (likeStatus === "Dislike") {

                if (checkOnLike.length > 0) {
                    // Удаляем дизлайк
                    await queryRunner.query(
                        `DELETE FROM comments_like_storage WHERE user_id = $1 AND comment_id = $2`,
                        [userId, commentId]
                    );
                }
                if (checkOnDislike.length === 0) {
                    // Добавляем лайк
                    await queryRunner.query(
                        `INSERT INTO comments_dislike_storage (added_at, user_id, user_login, comment_id) VALUES ($1, $2, $3, $4)`,
                        [new Date(), userId, login, commentId]
                    );

                }
                return comment;
            }

            // NONE статус
            if (likeStatus === "None") {

                if (checkOnLike.length > 0) {
                    await queryRunner.query(
                        `DELETE FROM comments_like_storage WHERE user_id = $1 AND comment_id = $2`,
                        [userId, commentId]
                    );
                }
                if (checkOnDislike.length > 0) {
                    await queryRunner.query(
                        `DELETE FROM comments_dislike_storage WHERE user_id = $1 AND comment_id = $2`,
                        [userId, commentId]
                    );
                }
                return comment;
            }
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new Error('Error while processing like/dislike operation');
        } finally {
            await queryRunner.commitTransaction();
            await queryRunner.release();
        }
    }
    
    
}