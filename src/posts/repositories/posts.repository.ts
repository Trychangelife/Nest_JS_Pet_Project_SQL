import { Injectable} from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { LIKES } from "src/utils/types"
import { UsersType } from "src/users/dto/UsersType"
import { CommentsType } from "src/comments/dto/CommentsType"
import { PostsType } from "src/posts/dto/PostsType"
import { BlogsType } from "src/blogs/dto/BlogsType"
import { post } from "typegoose"

export const postViewModel = {
    _id: 0,
    id: 1,
    title: 1,
    shortDescription: 1,
    content: 1,
    blogId: 1,
    blogName: 1,
    createdAt: 1,
    extendedLikesInfo: 1
}

export const commentsVievModel = {
    _id: 0,
    id: 1,
    content: 1,
    commentatorInfo: {userId: 1, userLogin: 1},
    createdAt: 1,
    likesInfo:1,
    //likeStorage: 1,
    //dislikeStorage: 1
}

@Injectable()
export class PostRepository {

    constructor (
    @InjectModel('Posts') protected postsModel: Model<PostsType>, 
    @InjectModel('Blogs') protected bloggerModel: Model<BlogsType>, 
    @InjectModel('Comments') protected commentsModel: Model<CommentsType>,
    @InjectModel('Users') protected usersModel: Model<UsersType>) {

    }
async allPosts(skip: number, limit: number, page?: number, userId?: string): Promise<object> {
    const totalCount = await this.postsModel.countDocuments({})
    const pagesCount = Math.ceil(totalCount / limit)
    const cursor = await this.postsModel.find({}, postViewModel).skip(skip).limit(limit)
    const arrayForReturn = []
    const targetPostWithAggregation = await this.postsModel.aggregate([{
        $project: {_id: 0 ,id: 1, title: 1, shortDescription: 1, content: 1, blogId: 1, blogName: 1, createdAt: 1, extendedLikesInfo: {likesCount: 1, dislikesCount: 1, myStatus: 1, newestLikes: {addedAt: 1, userId: 1, login: 1}}}}
    ])
    for (let index = 0; index < targetPostWithAggregation.length; index++) {
        let post = {...targetPostWithAggregation[index], extendedLikesInfo: {...targetPostWithAggregation[index].extendedLikesInfo, newestLikes: targetPostWithAggregation[index].extendedLikesInfo.newestLikes.reverse().slice(0,3)
        }};
        const checkOnDislike = await this.postsModel.findOne({$and: [{id: post.id}, {"dislikeStorage.userId": userId}]}).lean()
        const checkOnLike = await this.postsModel.findOne({$and: [{id: post.id}, {"extendedLikesInfo.newestLikes.userId": userId}]}).lean()
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
        post.extendedLikesInfo.myStatus = myStatus
        arrayForReturn.push(post)
    }
    
    

    // ВЕРНУТЬ ЗДЕСЬ В ITEMS arrayForReturn и РАСКОМЕНТИТЬ СВЕРХУ
    return { pagesCount: pagesCount, page: page, pageSize: limit, totalCount: totalCount, items: arrayForReturn.reverse() }
} 
async targetPosts(postId: string, userId?: string, description?: string): Promise<PostsType | undefined> {
    if (description === "full") { return await this.postsModel.findOne({id: postId}).lean()}
    const targetPost: PostsType | null = await this.postsModel.findOne({ id: postId }, postViewModel)
    const checkOnDislike = (await this.postsModel.findOne({$and: [{id: postId}, {"dislikeStorage.userId": userId}]}).lean())
    const checkOnLike = (await this.postsModel.findOne({$and: [{id: postId}, {"extendedLikesInfo.newestLikes.userId": userId}]}).lean())
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
    
    const targetPostWithAggregation = await this.postsModel.aggregate([{
        $project: {_id: 0 ,id: 1, title: 1, shortDescription: 1, content: 1, blogId: 1, blogName: 1, createdAt: 1, extendedLikesInfo: {likesCount: 1, dislikesCount: 1, myStatus: myStatus, newestLikes: {addedAt: 1, userId: 1, login: 1}}}
    }
    ]).match({id: postId})
    if (targetPostWithAggregation == null) {
        return undefined
    }
    else {
        //return targetPostWithAggregation
        try {
            //return targetPostWithAggregation[0]
            return {...targetPostWithAggregation[0], extendedLikesInfo: {...targetPostWithAggregation[0].extendedLikesInfo, newestLikes: targetPostWithAggregation[0].extendedLikesInfo.newestLikes.reverse().slice(0,3)}}; 
        } catch {
            return targetPostWithAggregation[0]
        }
        
    }
}
async allPostsSpecificBlogger(blogId: string, skip: number, pageSize?: number, page?: number, userId?: string): Promise<object | undefined> {


    const totalCount = await this.postsModel.countDocuments({ blogId: blogId })
    const checkBloggerExist = await this.bloggerModel.countDocuments({ id: blogId })
    if (checkBloggerExist < 1) { return undefined }
    if (page !== undefined && pageSize !== undefined) {
        const postsBloggerWithPaginator = await this.postsModel.find({ blogId: blogId }, postViewModel).skip(skip).limit(pageSize).lean()
        const pagesCount = Math.ceil(totalCount / pageSize)
        const arrayForReturn = []
        const targetPostWithAggregation = await this.postsModel.aggregate([{
        $project: {_id: 0 ,id: 1, title: 1, shortDescription: 1, content: 1, blogId: 1, blogName: 1, createdAt: 1, extendedLikesInfo: {likesCount: 1, dislikesCount: 1, myStatus: 1, newestLikes: {addedAt: 1, userId: 1, login: 1}}}}
    ]).match({blogId: blogId})
    for (let index = 0; index < targetPostWithAggregation.length; index++) {
        let post = {...targetPostWithAggregation[index], extendedLikesInfo: {...targetPostWithAggregation[index].extendedLikesInfo, newestLikes: targetPostWithAggregation[index].extendedLikesInfo.newestLikes.reverse().slice(0,3)
        }};
        const checkOnDislike = await this.postsModel.findOne({$and: [{id: post.id}, {"dislikeStorage.userId": userId}]}).lean()
        const checkOnLike = await this.postsModel.findOne({$and: [{id: post.id}, {"extendedLikesInfo.newestLikes.userId": userId}]}).lean()
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
        post.extendedLikesInfo.myStatus = myStatus
        arrayForReturn.push(post)
    }
        if (page > 0 || pageSize > 0) {
            return { pagesCount, page: page, pageSize: pageSize, totalCount, items: arrayForReturn.reverse() }
        }
        else {
            const postsBloggerWithOutPaginator = await this.postsModel.find({ blogId: blogId }).lean()
            return { pagesCount: 0, page: page, pageSize: pageSize, totalCount, items: postsBloggerWithOutPaginator }
        }

    }
}
async releasePost(newPosts: PostsType, blogId: string, bloggerIdUrl?: string): Promise<object | string> {
    const findBlogger = await this.bloggerModel.countDocuments({ id: blogId })
    if (findBlogger < 1) { return "400" }
    await this.postsModel.create(newPosts)
    const result: PostsType | null = await this.postsModel.findOne({ id: newPosts.id }, postViewModel).lean()
    if (result !== null) { return result }
    else { return "400" }
}
async changePost(postId: string, title: string, shortDescription: string, content: string, blogId: string): Promise<string | object> {

    const foundPost = await this.postsModel.findOne({ id: postId }, postViewModel).lean()
    const foundBlogger = await this.bloggerModel.findOne({ id: blogId }).lean()
    if (foundPost !== null && foundBlogger !== null) {
        await this.postsModel.updateOne({ id: postId }, { $set: { title: title, shortDescription: shortDescription, content: content, } })
        return foundPost
    }
    else if (foundBlogger == null) {
        return '400'
    }
    else {
        return "404"
    }
}
async deletePost(postId: string, blogId?: string): Promise<boolean> {
    if (blogId || postId) {
        const byPostId = await this.postsModel.deleteOne({ id: postId})
        const byBlogId = await this.postsModel.deleteOne({blogId: blogId})
        if (byBlogId.deletedCount === 1 || byPostId.deletedCount === 1) {
            return true
        }
    }
    else {
        return false
    }
    // Тут изменил ранее поиск был по BlogID - но вроде некорректно
    // const result = await this.postsModel.deleteOne({ id: postId })
    // return result.deletedCount === 1
}
async createCommentForSpecificPost(createdComment: CommentsType): Promise<CommentsType | boolean> {

    await this.commentsModel.create(createdComment)
    const foundNewPost: CommentsType = await this.commentsModel.findOne({id: createdComment.id}, commentsVievModel).lean()
    if (foundNewPost !== null) {
    return foundNewPost}
    else {return false}
}
async takeCommentByIdPost (postId: string, skip: number, limit: number, page: number, userId?: string, sortBy?: string, sortDirection?: string): Promise<object | boolean> {
    const findPosts = await this.postsModel.findOne({id: postId}).lean()
    const totalCount = await this.commentsModel.countDocuments({postId: postId})
    const pagesCount = Math.ceil(totalCount / limit)
    let ascOrDesc: any = -1 
    if (sortDirection === 'asc') {ascOrDesc = 1} 
    if (findPosts !== null) {
    const findComments = await this.commentsModel.find({postId: postId}, commentsVievModel).skip(skip).limit(limit).lean()
    const commentsWithAggregation = await this.commentsModel.aggregate([{
        $project: {_id: 0 ,id: 1, content: 1, commentatorInfo: {userId: 1, userLogin: 1}, createdAt: 1, postId: 1, likesInfo: 1}}
    ]).sort({createdAt: ascOrDesc}).match({postId: postId})
    const commentsWithAggregation1 = await this.commentsModel.find({postId: postId},commentsVievModel
    ).skip(skip).limit(limit).lean().sort({createdAt: ascOrDesc})

    const arrayForReturn = []
    const arrayForReturn2 = []
    for (let index = 0; index < commentsWithAggregation1.length; index++) {

        // {...targetPostWithAggregation[0], extendedLikesInfo: {...targetPostWithAggregation[0].extendedLikesInfo, newestLikes: targetPostWithAggregation[0].extendedLikesInfo.newestLikes.reverse().slice(0,3)
        // }}; 

        let comment = {...commentsWithAggregation1[index], likesInfo: {...commentsWithAggregation[index].likesInfo}};
        const checkOnDislike = await this.commentsModel.findOne({$and: [{id: comment.id}, {"dislikeStorage.userId": userId}]}).lean()
        const checkOnLike = await this.commentsModel.findOne({$and: [{id: comment.id}, {"likeStorage.userId": userId}]}).lean()
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
    comment.likesInfo.myStatus = myStatus
    delete comment.postId
        arrayForReturn.push(comment)
    }

    // ЕСЛИ НУЖНО БУДЕТ ВЕРНУТЬ ОБРАТНО С ЛАЙКАМИ - Просто в ITEMS возвращаем arrayForReturn
    return { pagesCount: pagesCount, page: page, pageSize: limit, totalCount: totalCount, items: arrayForReturn }}
    else { return false}
}

async like_dislike(postId: string, likeStatus: LIKES, userId: string, login: string): Promise<string | object> {
    const foundPost = await this.postsModel.findOne({ id: postId }, postViewModel).lean()
    const foundUser = await this.usersModel.findOne({ id: userId }).lean()
    try {
        const likesCountPlusLike = foundPost.extendedLikesInfo.likesCount + 1
        const likesCountMinusLike = foundPost.extendedLikesInfo.likesCount - 1
        const dislikesCountPlusLike = foundPost.extendedLikesInfo.dislikesCount + 1
        const dislikesCountMinusDislike = foundPost.extendedLikesInfo.dislikesCount - 1
    
    
    const keys = Object.keys(likeStatus)

    // WHEN WE HAVE LIKE
    if (foundPost !== null && foundUser !== null && likeStatus === "Like") {
        const checkOnLike = await this.postsModel.find({$and: [{"extendedLikesInfo.newestLikes.userId": userId}, {id: postId}] } ).lean()
        const howMuchLikes = await this.postsModel.find({"extendedLikesInfo.newestLikes": []}).countDocuments()
        const checkOnDislike = await this.postsModel.find({$and: [{"dislikeStorage.userId": userId}, {id: postId}] } ).lean()
        if (checkOnDislike.length > 0) {
            // Проверяем, вдруг уже есть дизлайк, нужно его убрать (одновременно два статуса быть не может)
            await this.postsModel.updateOne({ id: postId }, { $set: {"extendedLikesInfo.dislikesCount": dislikesCountMinusDislike } })
            await this.postsModel.updateOne({id: postId}, {$pull: {dislikeStorage: {userId}}})
        }
        if (checkOnLike.length > 0) {
            // Лайк уже стоит, значит убираем из всех storage упоминания о этом лайке
            //await this.postsModel.updateOne({ id: postId }, { $set: {"extendedLikesInfo.likesCount": likesCountMinusLike } })
            //await this.postsModel.updateOne({id: postId}, {$pull: {"extendedLikesInfo.newestLikes": {userId}}})
            //await this.postsModel.updateOne({id: postId}, {$pull: {likeStorage: {userId}}})
            return foundPost
        }
        else {
            // Лайка нет, добавляем информацию о оставленном лайке в storage 
            await this.postsModel.updateOne({ id: postId }, { $set: {"extendedLikesInfo.likesCount": likesCountPlusLike } })
            await this.postsModel.findOneAndUpdate({id: postId}, {$push: {"extendedLikesInfo.newestLikes": {addedAt: new Date(), userId: userId, login: login}}})
            await this.postsModel.findOneAndUpdate({id: postId}, {$push: {likeStorage: {addedAt: new Date(), userId: userId, login: login}}})
            return foundPost
        }
    }
    // WHEN WE HAVE DISLIKE
    else if (foundPost !== null && foundUser !== null && likeStatus === "Dislike") {
        const checkOnDislike = await this.postsModel.find({$and: [{"dislikeStorage.userId": userId}, {id: postId}] } ).lean()
        const checkOnLike = await this.postsModel.find({$and: [{"extendedLikesInfo.newestLikes.userId": userId}, {id: postId}] } ).lean()
        if (checkOnLike.length > 0) {
            // Проверяем, вдруг уже есть лайк, нужно его убрать (одновременно два статуса быть не может)
            await this.postsModel.updateOne({ id: postId }, { $set: {"extendedLikesInfo.likesCount": likesCountMinusLike } })
            await this.postsModel.updateOne({id: postId}, {$pull: {"extendedLikesInfo.newestLikes": {userId}}})
            await this.postsModel.updateOne({id: postId}, {$pull: {likeStorage: {userId}}})
        }
        if (checkOnDislike.length > 0) {
            // Дизлайк уже стоит, значит убираем из всех storage упоминания о этом Дизлайке
        //await this.postsModel.updateOne({ id: postId }, { $set: {"extendedLikesInfo.dislikesCount": dislikesCountMinusDislike } })
        //await this.postsModel.updateOne({id: postId}, {$pull: {dislikeStorage: {userId}}})
        return foundPost
        }
        else {
            // Дизлайка нет, добавляем информацию о оставленном Дизлайке в storage 
            await this.postsModel.updateOne({ id: postId }, { $set: {"extendedLikesInfo.dislikesCount": dislikesCountPlusLike } })
            await this.postsModel.findOneAndUpdate({id: postId}, {$push: {dislikeStorage: {addedAt: new Date(), userId: userId, login: login}}})
            return foundPost
    }
    } 
    // WHEN WE HAVE NONE
    else if (foundPost !== null && foundUser !== null && likeStatus === "None") {
        const checkOnDislike = await this.postsModel.find({$and: [{"dislikeStorage.userId": userId}, {id: postId}] } ).lean()
        const checkOnLike = await this.postsModel.find({$and: [{"likeStorage.userId": userId}, {id: postId}] } ).lean()

        // Проверяем наличие лайков/дизлайков, если что-то есть, убираем, так как статус NONE
        if (checkOnLike.length > 0) {
            await this.postsModel.updateOne({id: postId }, { $set: {"extendedLikesInfo.likesCount": likesCountMinusLike } })
            await this.postsModel.updateOne({id: postId}, {$pull: {"extendedLikesInfo.newestLikes": {userId}}})
            await this.postsModel.updateOne({id: postId}, {$pull: {likeStorage: {userId}}})
            return foundPost
        }
       else if (checkOnDislike.length > 0) {
            await this.postsModel.updateOne({ id: postId }, { $set: {"extendedLikesInfo.dislikesCount": dislikesCountMinusDislike } })
            await this.postsModel.updateOne({id: postId}, {$pull: {dislikeStorage: {userId}}})
            return foundPost
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