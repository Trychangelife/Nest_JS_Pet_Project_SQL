import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { BlogsType } from "src/blogs/dto/BlogsType"
import { UsersType } from "src/users/dto/UsersType"
import { BanStatus } from "../dto/banStatus"

const modelViewBloggers = {
    _id: 0,
    id: 1,
    name: 1,
    description: 1,
    websiteUrl: 1,
    createdAt: 1,
    isMembership: 1,
    blogOwnerInfo: {
        userId: 1,
        userLogin: 1
    }
}

@Injectable()
export class BlogsSuperAdminRepository {

    constructor(@InjectModel('Blogs') protected blogsModel: Model<BlogsType>) {
        
    }

    async getAllBlogs(skip: number, limit?: number, searchNameTerm?: string | null, page?: number, sortBy?: string, sortDirection?: string): Promise<object> {

        const options = { 
            sort: { [sortBy]: [sortDirection] },
            limit: limit,
            skip: skip, 
        };
        if (page !== undefined && limit !== undefined) {
            const cursor = await this.blogsModel.find({}, modelViewBloggers, options)
            const totalCount = await this.blogsModel.countDocuments({})
            const pagesCount = Math.ceil(totalCount / limit)
            const fullData = await this.blogsModel.find({}, modelViewBloggers)

            if (searchNameTerm !== null) {
                const cursorWithRegEx = await this.blogsModel.find({ name: { $regex: searchNameTerm, $options: 'i' } }, modelViewBloggers, options)
                const totalCountWithRegex = cursorWithRegEx.length
                const pagesCountWithRegex = Math.ceil(totalCountWithRegex / limit)
                return { pagesCount: pagesCountWithRegex, page: page, pageSize: limit, totalCount: totalCountWithRegex, items: cursorWithRegEx }
            }
            // if (banStatus === "banned") {
            //     const cursorWithRegEx = await this.blogsModel.find({ "banInfo.isBanned": true }, modelViewBloggers, options)
            //     const totalCountWithRegex = cursorWithRegEx.length
            //     const pagesCountWithRegex = Math.ceil(totalCountWithRegex / limit)
            //     return { pagesCount: pagesCountWithRegex, page: page, pageSize: limit, totalCount: totalCountWithRegex, items: cursorWithRegEx }
            // }
            // if (banStatus === "notBanned") {
            //     const cursorWithRegEx = await this.blogsModel.find({ "banInfo.isBanned": false }, modelViewBloggers, options)
            //     const totalCountWithRegex = cursorWithRegEx.length
            //     const pagesCountWithRegex = Math.ceil(totalCountWithRegex / limit)
            //     return { pagesCount: pagesCountWithRegex, page: page, pageSize: limit, totalCount: totalCountWithRegex, items: cursorWithRegEx }
            // }
            if (skip > 0 || limit > 0) {
                return { pagesCount, page: page, pageSize: limit, totalCount, items: cursor }
            }
            else return { pagesCount: 0, page: page, pageSize: limit, totalCount, items: fullData }
        }
        else {
            return await this.blogsModel.find({}, modelViewBloggers)
        }

    }
    async targetBloggers(id: string): Promise<object | undefined> {
        const blogger: BlogsType | null = await this.blogsModel.findOne({ id: id }, modelViewBloggers).lean()
        if (blogger !== null) {
            return blogger
        }
        else {
            false
        }
    }
    async createBlogger(newBlogger: BlogsType): Promise<BlogsType | null> {
        await this.blogsModel.create(newBlogger)
        return await this.blogsModel.findOne({ id: newBlogger.id }, modelViewBloggers).lean()
    }
    async changeBlogger(id: string, name: any, websiteUrl: string, description: string): Promise<boolean> {
        const result = await this.blogsModel.updateOne({ id: id }, { $set: { name: name, websiteUrl: websiteUrl, description: description } })
        return result.matchedCount === 1
    }
    async deleteBlogger(id: string): Promise<boolean> {
        const result = await this.blogsModel.deleteOne({ id: id })
        return result.deletedCount === 1
    }
    async deleteAllBlogs(): Promise<boolean> {
        const afterDelete = await this.blogsModel.deleteMany({})
        return afterDelete.acknowledged
    } 
    
    async BindingBlogToUserById(blogId: string, userId: string, user: UsersType): Promise<boolean> {
        if (blogId && userId) {
            const result = await this.blogsModel.updateOne({ id: blogId }, { $set: { "blogOwnerInfo.userId": user.id, "blogOwnerInfo.userLogin": user.login } })
            return result.matchedCount === 1
        }
        else {
            return false
        }
    }
}