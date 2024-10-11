"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BlogsRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const modelViewBloggers = {
    _id: 0,
    id: 1,
    name: 1,
    description: 1,
    websiteUrl: 1,
    createdAt: 1,
    isMembership: 1
};
let BlogsRepository = class BlogsRepository {
    constructor(blogsModel) {
        this.blogsModel = blogsModel;
    }
    async getAllBlogs(skip, limit, searchNameTerm, page, sortBy = 'createdAt', sortDirection = 'desc') {
        const sortValue = sortDirection === 'asc' ? 1 : -1;
        const options = {
            sort: { [sortBy]: sortValue },
            limit: limit,
            skip: skip,
        };
        if (page !== undefined && limit !== undefined) {
            let query = {};
            if (searchNameTerm !== null) {
                query = { name: { $regex: searchNameTerm, $options: 'i' } };
            }
            const cursor = await this.blogsModel.find(query, modelViewBloggers)
                .sort({ [sortBy]: sortValue })
                .limit(limit)
                .skip(skip)
                .exec();
            const totalCount = await this.blogsModel.countDocuments(query);
            const pagesCount = Math.ceil(totalCount / limit);
            return {
                pagesCount,
                page: page,
                pageSize: limit,
                totalCount,
                items: cursor,
            };
        }
        else {
            return await this.blogsModel.find({}, modelViewBloggers).exec();
        }
    }
    async targetBloggers(id, userId) {
        if (userId) {
            const fullDateWithOutProject = await this.blogsModel.findOne({ "blogOwnerInfo.userId": userId }).lean();
            return fullDateWithOutProject;
        }
        const blogger = await this.blogsModel.findOne({ id: id }, modelViewBloggers).lean();
        if (blogger !== null) {
            return blogger;
        }
        else {
            false;
        }
    }
    async createBlogger(newBlogger) {
        await this.blogsModel.create(newBlogger);
        return await this.blogsModel.findOne({ id: newBlogger.id }, modelViewBloggers).lean();
    }
    async changeBlogger(id, name, websiteUrl, description) {
        const result = await this.blogsModel.updateOne({ id: id }, { $set: { name: name, websiteUrl: websiteUrl, description: description } });
        return result.matchedCount === 1;
    }
    async deleteBlogger(id) {
        const result = await this.blogsModel.deleteOne({ id: id });
        return result.deletedCount === 1;
    }
    async deleteAllBlogs() {
        const afterDelete = await this.blogsModel.deleteMany({});
        return afterDelete.acknowledged;
    }
};
exports.BlogsRepository = BlogsRepository;
exports.BlogsRepository = BlogsRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Blogs')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], BlogsRepository);
//# sourceMappingURL=blogs.repository.js.map