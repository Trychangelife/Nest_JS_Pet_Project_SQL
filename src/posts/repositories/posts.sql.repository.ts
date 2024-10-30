import { Injectable, Next } from "@nestjs/common"
import { InjectDataSource } from "@nestjs/typeorm"
import { BlogsType } from "src/blogs/dto/BlogsType"
import { PostsType, PostsTypeView } from "src/posts/dto/PostsType"
import { LIKES } from "src/utils/types"
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

    constructor (@InjectDataSource() protected dataSource: DataSource) {

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

    asyc 

    async releasePost(newPosts: PostsType, foundBlog: BlogsType): Promise<PostsTypeView | null> {

        const postAfterCreated: PostsType = await this.dataSource.query(`
    INSERT INTO "posts" (title, "short_description", content, "blog_id", "blog_name", "created_at", "author_user_id")
    VALUES ($1, $2, $3, $4, $5, $6, $7)
    RETURNING *
    `, [newPosts.title, newPosts.shortDescription, newPosts.content, foundBlog.id, foundBlog.name, newPosts.createdAt, foundBlog.owner_user_id])


        console.log(postAfterCreated[0])
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
// async createCommentForSpecificPost(createdComment: CommentsType): Promise<CommentsType | boolean> {

//     await this.commentsModel.create(createdComment)
//     const foundNewPost: CommentsType = await this.commentsModel.findOne({id: createdComment.id}, commentsVievModel).lean()
//     if (foundNewPost !== null) {
//     return foundNewPost}
//     else {return false}
// }
// async takeCommentByIdPost (postId: string, skip: number, limit: number, page: number, userId?: string): Promise<object | boolean> {
//     const findPosts = await this.postsModel.findOne({id: postId}).lean()
//     const totalCount = await this.commentsModel.count({postId: postId})
//     const pagesCount = Math.ceil(totalCount / limit)
    
//     if (findPosts !== null) {
//     const findComments = await this.commentsModel.find({postId: postId}, commentsVievModel).skip(skip).limit(limit).lean()
//     const commentsWithAggregation = await this.commentsModel.aggregate([{
//         $project: {_id: 0 ,id: 1, content: 1, userId: 1, userLogin: 1, addedAt: 1, postId: 1, likesInfo: 1}}
//     ]).match({postId: postId})
//     const arrayForReturn = []
//     for (let index = 0; index < commentsWithAggregation.length; index++) {

//         // {...targetPostWithAggregation[0], extendedLikesInfo: {...targetPostWithAggregation[0].extendedLikesInfo, newestLikes: targetPostWithAggregation[0].extendedLikesInfo.newestLikes.reverse().slice(0,3)
//         // }}; 

//         let comment = {...commentsWithAggregation[index], likesInfo: {...commentsWithAggregation[index].likesInfo
//              }};
//         const checkOnDislike = await this.commentsModel.findOne({$and: [{id: comment.id}, {"dislikeStorage.userId": userId}]}).lean()
//         const checkOnLike = await this.commentsModel.findOne({$and: [{id: comment.id}, {"likeStorage.userId": userId}]}).lean()
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
//     comment.likesInfo.myStatus = myStatus
//     delete comment.postId
//         arrayForReturn.push(comment)
//     }



//     return { pagesCount: pagesCount, page: page, pageSize: limit, totalCount: totalCount, items: arrayForReturn }}
//     else { return false}
// }

// async like_dislike(postId: string, likeStatus: LIKES, userId: string, login: string): Promise<string | object> {
//     const foundPost = await this.postsModel.findOne({ id: postId }, postViewModel).lean()
//     const foundUser = await this.usersModel.findOne({ id: userId }).lean()
//     try {
//         const likesCountPlusLike = foundPost.extendedLikesInfo.likesCount + 1
//         const likesCountMinusLike = foundPost.extendedLikesInfo.likesCount - 1
//         const dislikesCountPlusLike = foundPost.extendedLikesInfo.dislikesCount + 1
//         const dislikesCountMinusDislike = foundPost.extendedLikesInfo.dislikesCount - 1
    
    
//     const keys = Object.keys(likeStatus)

//     // WHEN WE HAVE LIKE
//     if (foundPost !== null && foundUser !== null && likeStatus === "Like") {
//         const checkOnLike = await this.postsModel.find({$and: [{"extendedLikesInfo.newestLikes.userId": userId}, {id: postId}] } ).lean()
//         const howMuchLikes = await this.postsModel.find({"extendedLikesInfo.newestLikes": []}).count()
//         const checkOnDislike = await this.postsModel.find({$and: [{"dislikeStorage.userId": userId}, {id: postId}] } ).lean()
//         console.log(checkOnLike)
//         if (checkOnDislike.length > 0) {
//             // Проверяем, вдруг уже есть дизлайк, нужно его убрать (одновременно два статуса быть не может)
//             await this.postsModel.updateOne({ id: postId }, { $set: {"extendedLikesInfo.dislikesCount": dislikesCountMinusDislike } })
//             await this.postsModel.updateOne({id: postId}, {$pull: {dislikeStorage: {userId}}})
//         }
//         if (checkOnLike.length > 0) {
//             // Лайк уже стоит, значит убираем из всех storage упоминания о этом лайке
//             //await this.postsModel.updateOne({ id: postId }, { $set: {"extendedLikesInfo.likesCount": likesCountMinusLike } })
//             //await this.postsModel.updateOne({id: postId}, {$pull: {"extendedLikesInfo.newestLikes": {userId}}})
//             //await this.postsModel.updateOne({id: postId}, {$pull: {likeStorage: {userId}}})
//             return foundPost
//         }
//         else {
//             // Лайка нет, добавляем информацию о оставленном лайке в storage 
//             await this.postsModel.updateOne({ id: postId }, { $set: {"extendedLikesInfo.likesCount": likesCountPlusLike } })
//             await this.postsModel.findOneAndUpdate({id: postId}, {$push: {"extendedLikesInfo.newestLikes": {addedAt: new Date(), userId: userId, login: login}}})
//             await this.postsModel.findOneAndUpdate({id: postId}, {$push: {likeStorage: {addedAt: new Date(), userId: userId, login: login}}})
//             return foundPost
//         }
//     }
//     // WHEN WE HAVE DISLIKE
//     else if (foundPost !== null && foundUser !== null && likeStatus === "Dislike") {
//         const checkOnDislike = await this.postsModel.find({$and: [{"dislikeStorage.userId": userId}, {id: postId}] } ).lean()
//         const checkOnLike = await this.postsModel.find({$and: [{"extendedLikesInfo.newestLikes.userId": userId}, {id: postId}] } ).lean()
//         if (checkOnLike.length > 0) {
//             // Проверяем, вдруг уже есть лайк, нужно его убрать (одновременно два статуса быть не может)
//             await this.postsModel.updateOne({ id: postId }, { $set: {"extendedLikesInfo.likesCount": likesCountMinusLike } })
//             await this.postsModel.updateOne({id: postId}, {$pull: {"extendedLikesInfo.newestLikes": {userId}}})
//             await this.postsModel.updateOne({id: postId}, {$pull: {likeStorage: {userId}}})
//         }
//         if (checkOnDislike.length > 0) {
//             // Дизлайк уже стоит, значит убираем из всех storage упоминания о этом Дизлайке
//         //await this.postsModel.updateOne({ id: postId }, { $set: {"extendedLikesInfo.dislikesCount": dislikesCountMinusDislike } })
//         //await this.postsModel.updateOne({id: postId}, {$pull: {dislikeStorage: {userId}}})
//         return foundPost
//         }
//         else {
//             // Дизлайка нет, добавляем информацию о оставленном Дизлайке в storage 
//             await this.postsModel.updateOne({ id: postId }, { $set: {"extendedLikesInfo.dislikesCount": dislikesCountPlusLike } })
//             await this.postsModel.findOneAndUpdate({id: postId}, {$push: {dislikeStorage: {addedAt: new Date(), userId: userId, login: login}}})
//             return foundPost
//     }
//     } 
//     // WHEN WE HAVE NONE
//     else if (foundPost !== null && foundUser !== null && likeStatus === "None") {
//         const checkOnDislike = await this.postsModel.find({$and: [{"dislikeStorage.userId": userId}, {id: postId}] } ).lean()
//         const checkOnLike = await this.postsModel.find({$and: [{"likeStorage.userId": userId}, {id: postId}] } ).lean()

//         // Проверяем наличие лайков/дизлайков, если что-то есть, убираем, так как статус NONE
//         if (checkOnLike.length > 0) {
//             await this.postsModel.updateOne({id: postId }, { $set: {"extendedLikesInfo.likesCount": likesCountMinusLike } })
//             await this.postsModel.updateOne({id: postId}, {$pull: {"extendedLikesInfo.newestLikes": {userId}}})
//             await this.postsModel.updateOne({id: postId}, {$pull: {likeStorage: {userId}}})
//             return foundPost
//         }
//        else if (checkOnDislike.length > 0) {
//             await this.postsModel.updateOne({ id: postId }, { $set: {"extendedLikesInfo.dislikesCount": dislikesCountMinusDislike } })
//             await this.postsModel.updateOne({id: postId}, {$pull: {dislikeStorage: {userId}}})
//             return foundPost
//        }
       
//     }
//     else if (foundUser == null) {
//         return '400'
//     }
//     else {
//         return "404"
//     }
//     } catch (error) {
//     return "404"
// }
// }
}