import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { LikesDTO } from "src/utils/class-validator.form"
import { LIKES } from "src/utils/types"
import { UsersType } from "src/users/dto/UsersType"
import { CommentsType, CommentsTypeView } from "src/comments/dto/CommentsType"
import { InjectDataSource } from "@nestjs/typeorm"
import { DataSource } from "typeorm"

@Injectable()
export class CommentsRepository {

    constructor (
        @InjectDataSource() protected dataSource: DataSource
    ) {

    }
    async commentsById(commentId: string, userId?: string): Promise<CommentsTypeView | null> {
        try {
            const [comment] = await this.dataSource.query(
                `
            SELECT * 
            FROM "comments" WHERE id = $1
                `, [commentId])
            if (comment !== null) {
                const resultView: CommentsTypeView = {
                    id: comment.id.toString(),
                    content: comment.content,
                    commentatorInfo: {
                        userId: comment.author_user_id,
                        userLogin: comment.author_login_id
                    }, 
                    createdAt: comment.created_at,
                    likesInfo: {
                        likesCount: 0,
                        dislikesCount: 0,
                        myStatus: LIKES.NONE
                    }
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
        const [comment] = await this.dataSource.query(
            `
        SELECT * 
        FROM "comments" WHERE id = $1
            `, [commentId])
        if (comment !== null && comment.author_user_id === userId) {
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
    }
    async deleteCommentByCommentId(commentId: string, userId: string): Promise<boolean | null> {
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
    }
    async like_dislike(
        commentId: string, 
        likeStatus: LikesDTO, 
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
    
            // Обновляем счетчики лайков и дизлайков на основе текущего статуса
            if (currentLikeStatus === 'Like') {
                // Проверяем, есть ли дизлайк, чтобы убрать его, если он существует
                const checkDislike = await queryRunner.query(
                    `SELECT * FROM comments_dislike_storage WHERE user_id = $1 AND comment_id = $2`, 
                    [userId, commentId]
                );
    
                if (checkDislike.length > 0) {
                    await queryRunner.query(
                        `UPDATE comments SET dislikes_count = dislikes_count - 1 WHERE id = $1`, 
                        [commentId]
                    );
    
                    await queryRunner.query(
                        `DELETE FROM comments_dislike_storage WHERE user_id = $1 AND comment_id = $2`, 
                        [userId, commentId]
                    );
                }
    
                // Проверяем, стоит ли уже лайк, чтобы убрать его, если он существует
                const checkLike = await queryRunner.query(
                    `SELECT * FROM comments_like_storage WHERE user_id = $1 AND comment_id = $2`, 
                    [userId, commentId]
                );
    
                if (checkLike.length > 0) {
                    return comment;
                } else {
                    await queryRunner.query(
                        `UPDATE comments SET likes_count = likes_count + 1 WHERE id = $1`, 
                        [commentId]
                    );
    
                    await queryRunner.query(
                        `INSERT INTO comments_like_storage (added_at, user_id, user_login, comment_id) VALUES ($1, $2, $3, $4)`, 
                        [new Date(), userId, login, commentId]
                    );
    
                    return comment;
                }
    
            } else if (currentLikeStatus === 'Dislike') {
                // Проверяем, стоит ли уже лайк, чтобы убрать его, если он существует
                const checkLike = await queryRunner.query(
                    `SELECT * FROM comments_like_storage WHERE user_id = $1 AND comment_id = $2`, 
                    [userId, commentId]
                );
    
                if (checkLike.length > 0) {
                    await queryRunner.query(
                        `UPDATE comments SET likes_count = likes_count - 1 WHERE id = $1`, 
                        [commentId]
                    );
    
                    await queryRunner.query(
                        `DELETE FROM comments_like_storage WHERE user_id = $1 AND comment_id = $2`, 
                        [userId, commentId]
                    );
                }
    
                // Проверяем, стоит ли уже дизлайк, чтобы убрать его, если он существует
                const checkDislike = await queryRunner.query(
                    `SELECT * FROM comments_dislike_storage WHERE user_id = $1 AND comment_id = $2`, 
                    [userId, commentId]
                );
    
                if (checkDislike.length > 0) {
                    return comment;
                } else {
                    await queryRunner.query(
                        `UPDATE comments SET dislikes_count = dislikes_count + 1 WHERE id = $1`, 
                        [commentId]
                    );
    
                    await queryRunner.query(
                        `INSERT INTO comments_dislike_storage (added_at, user_id, user_login, comment_id) VALUES ($1, $2, $3, $4)`, 
                        [new Date(), userId, login, commentId]
                    );
    
                    return comment;
                }
    
            } else if (currentLikeStatus === 'None') {
                // Если лайк стоит, убираем его
                const checkLike = await queryRunner.query(
                    `SELECT * FROM comments_like_storage WHERE user_id = $1 AND comment_id = $2`, 
                    [userId, commentId]
                );
    
                if (checkLike.length > 0) {
                    await queryRunner.query(
                        `UPDATE comments SET likes_count = likes_count - 1 WHERE id = $1`, 
                        [commentId]
                    );
    
                    await queryRunner.query(
                        `DELETE FROM comments_like_storage WHERE user_id = $1 AND comment_id = $2`, 
                        [userId, commentId]
                    );
    
                    return comment;
                }
    
                // Если дизлайк стоит, убираем его
                const checkDislike = await queryRunner.query(
                    `SELECT * FROM comments_dislike_storage WHERE user_id = $1 AND comment_id = $2`, 
                    [userId, commentId]
                );
    
                if (checkDislike.length > 0) {
                    await queryRunner.query(
                        `UPDATE comments SET dislikes_count = dislikes_count - 1 WHERE id = $1`, 
                        [commentId]
                    );
    
                    await queryRunner.query(
                        `DELETE FROM comments_dislike_storage WHERE user_id = $1 AND comment_id = $2`, 
                        [userId, commentId]
                    );
    
                    return comment;
                }
            }
    
            await queryRunner.commitTransaction();
            return comment;
    
        } catch (error) {
            await queryRunner.rollbackTransaction();
            throw new Error('Error while processing like/dislike operation');
        } finally {
            await queryRunner.release();
        }
    }
    
    
}