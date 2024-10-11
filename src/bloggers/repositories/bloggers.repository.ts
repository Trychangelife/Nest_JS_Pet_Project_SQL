import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { BlogsType } from "src/blogs/dto/BlogsType"
import { BloggersType } from "../dto/Bloggers.Blogs.Type"

const modelViewBloggers = {
    _id: 0,
    id: 1,
    name: 1,
    description: 1,
    websiteUrl: 1,
    createdAt: 1,
    isMembership: 1,
    // blogOwnerInfo: {
    //     userId: 1,
    //     userLogin: 1
    // }
}

@Injectable()
export class BlogsByBloggerRepository {

    constructor(@InjectModel('Blogs') protected blogsModel: Model<BlogsType>) {

    }

    async getAllBlogsForSpecificBlogger(skip: number, limit?: number, searchNameTerm?: string | null, page?: number, sortBy?: string, sortDirection?: string, userId?: string): Promise<object> {
        const options = {
            sort: { [sortBy]: [sortDirection] },
            limit: limit,
            skip: skip,
        };
        const cursor = await this.blogsModel.find({ "blogOwnerInfo.userId": userId }, modelViewBloggers, options)
        const totalCount = await this.blogsModel.countDocuments({ "blogOwnerInfo.userId": userId })
        const pagesCount = Math.ceil(totalCount / limit)
        const fullData = await this.blogsModel.find({ "blogOwnerInfo.userId": userId }, modelViewBloggers)

        if (searchNameTerm !== null) {
            const cursorWithRegEx = await this.blogsModel.find({
                $and: [
                    { "blogOwnerInfo.userId": userId },
                    { "name": { $regex: searchNameTerm, $options: "i" } }
                ]
            }, modelViewBloggers, options);
            const totalCountWithRegex = cursorWithRegEx.length
            const pagesCountWithRegex = Math.ceil(totalCountWithRegex / limit)
            return { pagesCount: pagesCountWithRegex, page: page, pageSize: limit, totalCount: totalCountWithRegex, items: cursorWithRegEx }
        }
        if (skip > 0 || limit > 0) {
            return { pagesCount, page: page, pageSize: limit, totalCount, items: cursor }
        }
        else return { pagesCount: 0, page: page, pageSize: limit, totalCount, items: fullData }

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
    async createBlogger(newBlogger: BloggersType): Promise<BloggersType | null> {
        await this.blogsModel.create(newBlogger)
        return await this.blogsModel.findOne({ id: newBlogger.id }, modelViewBloggers).lean()
    }
    async changeBlogger(id: string, name: any, websiteUrl: string, description: string): Promise<boolean> {
        const result = await this.blogsModel.updateOne({ id: id }, { $set: { name: name, websiteUrl: websiteUrl, description: description } })
        return result.matchedCount === 1
    }
    async deleteBlogForSpecificBlogger(blogId: string, userId: string): Promise<boolean> {
        const result = await this.blogsModel.deleteOne({ id: blogId, "blogOwnerInfo.userId": userId })
        return result.deletedCount === 1
    }
    async deleteAllBlogs(): Promise<boolean> {
        const afterDelete = await this.blogsModel.deleteMany({})
        return afterDelete.acknowledged
    }
}