import { Injectable } from "@nestjs/common"
import { InjectModel } from "@nestjs/mongoose"
import { Model } from "mongoose"
import { BloggersType } from "src/bloggers/dto/Bloggers.Blogs.Type"
import { BlogsType } from "src/blogs/dto/BlogsType"

const modelViewBloggers = {
    _id: 0,
    id: 1,
    name: 1,
    description: 1,
    websiteUrl: 1,
    createdAt: 1,
    isMembership: 1
}

@Injectable()
export class BlogsRepository {

    constructor(@InjectModel('Blogs') protected blogsModel: Model<BlogsType>) {

    }
    async getAllBlogs(
        skip: number,
        limit?: number,
        searchNameTerm?: string | null,
        page?: number,
        sortBy: string = 'createdAt', // Значение по умолчанию
        sortDirection: string = 'desc' // Значение по умолчанию
    ): Promise<object> {
        // Преобразуем sortDirection в числовое значение
        const sortValue = sortDirection === 'asc' ? 1 : -1;

        // Опции запроса, включая сортировку, лимит и пропуск
        const options = {
            sort: { [sortBy]: sortValue }, // Применение сортировки
            limit: limit,
            skip: skip,
        };

        // Если заданы page и limit, то применяем пагинацию
        if (page !== undefined && limit !== undefined) {
            let query = {};

            // Если есть searchNameTerm, добавляем его в запрос
            if (searchNameTerm !== null) {
                query = { name: { $regex: searchNameTerm, $options: 'i' } };
            }

            // Выполняем запрос с пагинацией и сортировкой
            const cursor = await this.blogsModel.find(query, modelViewBloggers)
                .sort({ [sortBy]: sortValue })
                .limit(limit)
                .skip(skip)
                .exec();

            // Считаем общее количество документов (с учетом фильтра по searchNameTerm, если он задан)
            const totalCount = await this.blogsModel.countDocuments(query);
            const pagesCount = Math.ceil(totalCount / limit);

            // Возвращаем данные в формате пагинации
            return {
                pagesCount,
                page: page,
                pageSize: limit,
                totalCount,
                items: cursor,
            };
        } else {
            // Если пагинация не нужна, возвращаем все документы
            return await this.blogsModel.find({}, modelViewBloggers).exec();
        }
    }

    async targetBloggers(id: string, userId?: string): Promise<object | undefined> {
        if (userId) {
            const fullDateWithOutProject = await this.blogsModel.findOne({ "blogOwnerInfo.userId": userId }).lean()
            return fullDateWithOutProject
        }
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
}