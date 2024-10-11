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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateBlogByBloggerUseCase = exports.UpdateBlogByBloggerCommand = void 0;
const cqrs_1 = require("@nestjs/cqrs");
const blogs_repository_1 = require("../../../blogs/repositories/blogs.repository");
class UpdateBlogByBloggerCommand {
    constructor(id, name, websiteUrl, description) {
        this.id = id;
        this.name = name;
        this.websiteUrl = websiteUrl;
        this.description = description;
    }
}
exports.UpdateBlogByBloggerCommand = UpdateBlogByBloggerCommand;
let UpdateBlogByBloggerUseCase = class UpdateBlogByBloggerUseCase {
    constructor(bloggerRepository) {
        this.bloggerRepository = bloggerRepository;
    }
    async execute(command) {
        const afterUpdate = await this.bloggerRepository.changeBlogger(command.id, command.name, command.websiteUrl, command.description);
        if (afterUpdate == true) {
            return "update";
        }
        else {
            return "404";
        }
    }
};
exports.UpdateBlogByBloggerUseCase = UpdateBlogByBloggerUseCase;
exports.UpdateBlogByBloggerUseCase = UpdateBlogByBloggerUseCase = __decorate([
    (0, cqrs_1.CommandHandler)(UpdateBlogByBloggerCommand),
    __metadata("design:paramtypes", [blogs_repository_1.BlogsRepository])
], UpdateBlogByBloggerUseCase);
//# sourceMappingURL=update_blog.js.map