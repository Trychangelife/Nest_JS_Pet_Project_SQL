import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { commentsVievModel } from "src/posts/repositories/posts.repository"
import { LikesDTO } from "src/utils/class-validator.form"
import { LIKES } from "src/utils/types"
import { UsersType } from "src/users/dto/UsersType"
import { CommentsType } from "src/comments/dto/CommentsType"

@Injectable()
export class CommentsRepository {

    constructor (
        @InjectModel('Comments') protected commentsModel: Model<CommentsType>,
        @InjectModel('Users') protected usersModel: Model<UsersType>
    ) {

    }

    async commentsByUserId(commentId: string, userId?: string): Promise<CommentsType | null> {
        const result = await this.commentsModel.findOne({ id: commentId }, commentsVievModel )
        const checkOnDislike = (await this.commentsModel.findOne({$and: [{id: commentId}, {"dislikeStorage.userId": userId}]}).lean())
        const checkOnLike = (await this.commentsModel.findOne({$and: [{id: commentId}, {"likeStorage.userId": userId}]}).lean())
        let myStatus = ''
    if (checkOnLike) {
        myStatus = "Like"
    }
    else if (checkOnDislike) {
        myStatus = "Dislike"
    }
    else {
        myStatus = "None"
    }
    const targetCommentWithAggregation = await this.commentsModel.aggregate([{
        $project: {_id: 0 ,id: 1, content: 1, commentatorInfo: {userId: 1, userLogin: 1}, createdAt: 1, likesInfo: {likesCount: 1, dislikesCount: 1, myStatus: myStatus}}}
    ]).match({id: commentId})
    if (targetCommentWithAggregation == null) {
        return null
    }
    else {
        return targetCommentWithAggregation[0]; 
    }
        
    }
    async updateCommentByCommentId(commentId: string, content: string, userId: string): Promise<boolean | null> {
        const findTargetComment = await this.commentsModel.findOne({ id: commentId }, commentsVievModel).lean()
        if (findTargetComment !== null && findTargetComment.commentatorInfo.userId === userId) {
            await this.commentsModel.updateOne({ id: commentId }, { $set: { content: content } })
            return true
        }
        if (findTargetComment == null) {
            return null
        }
        else {
            return false
        }
    }
    async deleteCommentByCommentId(commentId: string, userId: string): Promise<boolean | null> {
        const findTargetComment = await this.commentsModel.findOne({ id: commentId })
        if (findTargetComment !== null && findTargetComment.commentatorInfo.userId === userId) {
            await this.commentsModel.deleteOne({id: commentId})
            return true
        }
        if (findTargetComment == null) {
            return null
        }
        else {
            return false
        }
    }
    async like_dislike(commentId: string, likeStatus: LikesDTO, userId: string, login: string): Promise<string | object> {
        const foundComment = await this.commentsModel.findOne({ id: commentId }, commentsVievModel).lean()
        const foundUser = await this.usersModel.findOne({ id: userId }).lean()
        try {
            const likesCountPlusLike = foundComment.likesInfo.likesCount + 1
            const likesCountMinusLike = foundComment.likesInfo.likesCount - 1
            const dislikesCountPlusLike = foundComment.likesInfo.dislikesCount + 1
            const dislikesCountMinusDislike = foundComment.likesInfo.dislikesCount - 1
        
        
        const keys = Object.keys(likeStatus)
    
        // WHEN WE HAVE LIKE
        if (foundComment !== null && foundUser !== null && (likeStatus[keys[0]]) === "Like") {
            const checkOnLike = await this.commentsModel.find({$and: [{"likeStorage.userId": userId}, {id: commentId}] } ).lean()
            const howMuchLikes = await this.commentsModel.find({likeStorage: []}).countDocuments()
            const checkOnDislike = await this.commentsModel.find({$and: [{"dislikeStorage.userId": userId}, {id: commentId}] } ).lean()
         
            if (checkOnDislike.length > 0) {
                // Проверяем, вдруг уже есть дизлайк, нужно его убрать (одновременно два статуса быть не может)
                await this.commentsModel.updateOne({ id: commentId }, { $set: {"likesInfo.dislikesCount": dislikesCountMinusDislike } })
                await this.commentsModel.updateOne({id: commentId}, {$pull: {dislikeStorage: {userId}}})
            }
            if (checkOnLike.length > 0) {
                // Лайк уже стоит, значит убираем из всех storage упоминания о этом лайке
                //await this.commentsModel.updateOne({ id: commentId }, { $set: {"likesInfo.likesCount": likesCountMinusLike } })
                //await this.commentsModel.updateOne({id: commentId}, {$pull: {likeStorage: {userId}}})
                return foundComment
            }
            else {
                // Лайка нет, добавляем информацию о оставленном лайке в storage 
                await this.commentsModel.updateOne({ id: commentId }, { $set: {"likesInfo.likesCount": likesCountPlusLike } })
                await this.commentsModel.findOneAndUpdate({id: commentId}, {$push: {likeStorage: {addedAt: new Date(), userId: userId, login: login}}})
                return foundComment
            }
        }
        // WHEN WE HAVE DISLIKE
        else if (foundComment !== null && foundUser !== null && (likeStatus[keys[0]]) === "Dislike") {
            const checkOnDislike = await this.commentsModel.find({$and: [{"dislikeStorage.userId": userId}, {id: commentId}] } ).lean()
            const checkOnLike = await this.commentsModel.find({$and: [{"likeStorage.userId": userId}, {id: commentId}] } ).lean()
            if (checkOnLike.length > 0) {
                // Проверяем, вдруг уже есть лайк, нужно его убрать (одновременно два статуса быть не может)
                await this.commentsModel.updateOne({ id: commentId }, { $set: {"likesInfo.likesCount": likesCountMinusLike } })
                await this.commentsModel.updateOne({id: commentId}, {$pull: {likeStorage: {userId}}})
            }
            if (checkOnDislike.length > 0) {
                // Дизлайк уже стоит, значит убираем из всех storage упоминания о этом Дизлайке
            //await this.commentsModel.updateOne({ id: commentId }, { $set: {"likesInfo.dislikesCount": dislikesCountMinusDislike } })
            //await this.commentsModel.updateOne({id: commentId}, {$pull: {dislikeStorage: {userId}}})
            return foundComment
            }
            else {
                // Дизлайка нет, добавляем информацию о оставленном Дизлайке в storage 
                await this.commentsModel.updateOne({ id: commentId }, { $set: {"likesInfo.dislikesCount": dislikesCountPlusLike } })
                await this.commentsModel.findOneAndUpdate({id: commentId}, {$push: {dislikeStorage: {addedAt: new Date(), userId: userId, login: login}}})
                return foundComment
        }
        } 
        // WHEN WE HAVE NONE
        else if (foundComment !== null && foundUser !== null && (likeStatus[keys[0]]) === "None") {
            const checkOnDislike = await this.commentsModel.find({$and: [{"dislikeStorage.userId": userId}, {id: commentId}] } ).lean()
            const checkOnLike = await this.commentsModel.find({$and: [{"likeStorage.userId": userId}, {id: commentId}] } ).lean()
    
            // Проверяем наличие лайков/дизлайков, если что-то есть, убираем, так как статус NONE
            if (checkOnLike.length > 0) {
                await this.commentsModel.updateOne({id: commentId }, { $set: {"likesInfo.likesCount": likesCountMinusLike } })
                await this.commentsModel.updateOne({id: commentId}, {$pull: {likeStorage: {userId}}})
                return foundComment
            }
           else if (checkOnDislike.length > 0) {
                await this.commentsModel.updateOne({ id: commentId }, { $set: {"likesInfo.dislikesCount": dislikesCountMinusDislike } })
                await this.commentsModel.updateOne({id: commentId}, {$pull: {dislikeStorage: {userId}}})
                return foundComment
           }
           
        }
        else if (foundUser == null) {
            return '400'
        }
        else {
            return "404"
        }
        } catch (error) {
        return "404"
    }
    }
}