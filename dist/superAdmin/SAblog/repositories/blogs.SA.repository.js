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
exports.BlogsSuperAdminRepository = void 0;
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
    isMembership: 1,
    blogOwnerInfo: {
        userId: 1,
        userLogin: 1
    }
};
let BlogsSuperAdminRepository = class BlogsSuperAdminRepository {
    constructor(blogsModel) {
        this.blogsModel = blogsModel;
    }
    async getAllBlogs(skip, limit, searchNameTerm, page, sortBy, sortDirection) {
        const options = {
            sort: { [sortBy]: [sortDirection] },
            limit: limit,
            skip: skip,
        };
        if (page !== undefined && limit !== undefined) {
            const cursor = await this.blogsModel.find({}, modelViewBloggers, options);
            const totalCount = await this.blogsModel.countDocuments({});
            const pagesCount = Math.ceil(totalCount / limit);
            const fullData = await this.blogsModel.find({}, modelViewBloggers);
            if (searchNameTerm !== null) {
                const cursorWithRegEx = await this.blogsModel.find({ name: { $regex: searchNameTerm, $options: 'i' } }, modelViewBloggers, options);
                const totalCountWithRegex = cursorWithRegEx.length;
                const pagesCountWithRegex = Math.ceil(totalCountWithRegex / limit);
                return { pagesCount: pagesCountWithRegex, page: page, pageSize: limit, totalCount: totalCountWithRegex, items: cursorWithRegEx };
            }
            if (skip > 0 || limit > 0) {
                return { pagesCount, page: page, pageSize: limit, totalCount, items: cursor };
            }
            else
                return { pagesCount: 0, page: page, pageSize: limit, totalCount, items: fullData };
        }
        else {
            return await this.blogsModel.find({}, modelViewBloggers);
        }
    }
    async targetBloggers(id) {
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
    async BindingBlogToUserById(blogId, userId, user) {
        if (blogId && userId) {
            const result = await this.blogsModel.updateOne({ id: blogId }, { $set: { "blogOwnerInfo.userId": user.id, "blogOwnerInfo.userLogin": user.login } });
            return result.matchedCount === 1;
        }
        else {
            return false;
        }
    }
};
exports.BlogsSuperAdminRepository = BlogsSuperAdminRepository;
exports.BlogsSuperAdminRepository = BlogsSuperAdminRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Blogs')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], BlogsSuperAdminRepository);
//# sourceMappingURL=blogs.SA.repository.js.map