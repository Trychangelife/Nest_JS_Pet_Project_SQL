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
exports.BlogsRepositorySql = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
let BlogsRepositorySql = class BlogsRepositorySql {
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async allBloggers(skip, limit, searchNameTerm, page) {
        const totalCount = await this.dataSource.query(`SELECT COUNT(*) FROM "Bloggers"`);
        const keys = Object.keys(totalCount);
        const pagesCount = Math.ceil(totalCount[keys[0]].count / limit);
        if (searchNameTerm !== null) {
            const getAllBloggers = await this.dataSource.query(`
                SELECT * 
                FROM "Bloggers"
                WHERE name LIKE '${'%' + searchNameTerm + '%'}'
                ORDER BY id
                LIMIT $1 OFFSET $2
                `, [limit, skip]);
            return { pagesCount, page: page, pageSize: limit, totalCount: parseInt(totalCount[keys[0]].count), items: getAllBloggers };
        }
        else {
            const getAllBloggers = await this.dataSource.query(`
            SELECT * 
            FROM "Bloggers"
            ORDER BY id
            LIMIT $1 OFFSET $2
            `, [limit, skip]);
            return { pagesCount, page: page, pageSize: limit, totalCount: parseInt(totalCount[keys[0]].count), items: getAllBloggers };
        }
    }
    async targetBloggers(id) {
        const blogger = await this.dataSource.query(`
        SELECT * 
        FROM "Bloggers" WHERE id = $1
            `, [id]);
        if (blogger !== null) {
            return blogger;
        }
        else {
            return;
        }
    }
    async createBlogger(newBlogger) {
        const bloggerAfterCreate = await this.dataSource.query(`
        INSERT INTO "bloggers" (name, "website_url")
        VALUES ($1, $2)
        RETURNING *
        `, [newBlogger.name, newBlogger.websiteUrl]);
        return bloggerAfterCreate;
    }
    async changeBlogger(id, name, websiteUrl) {
        const update = await this.dataSource.query(`
        UPDATE "Bloggers"
        SET name = $2, "websiteUrl" = $3
        WHERE id = $1
        RETURNING *
        `, [id, name, websiteUrl]);
        if (update[0][0].name === name && update[0][0].websiteUrl === websiteUrl) {
            return true;
        }
        else {
            return false;
        }
    }
    async deleteBlogger(id) {
        const findUserAfterDelete = await this.dataSource.query(`SELECT id, name, "websiteUrl" FROM "Bloggers" WHERE id = $1`, [id]);
        if (findUserAfterDelete.length < 1) {
            return false;
        }
        else {
            await this.dataSource.query(`DELETE FROM "Bloggers" WHERE id = $1`, [id]);
            return true;
        }
    }
    async deleteAllBlogger() {
        await this.dataSource.query(`TRUNCATE TABLE "Bloggers"`);
        const checkTableAfterFullClear = await this.dataSource.query(`SELECT COUNT(*) FROM "Bloggers"`);
        if (checkTableAfterFullClear > 1) {
            return false;
        }
        else {
            return true;
        }
    }
};
exports.BlogsRepositorySql = BlogsRepositorySql;
exports.BlogsRepositorySql = BlogsRepositorySql = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectDataSource)()),
    __metadata("design:paramtypes", [typeorm_2.DataSource])
], BlogsRepositorySql);
//# sourceMappingURL=blogs.sql.repository.js.map