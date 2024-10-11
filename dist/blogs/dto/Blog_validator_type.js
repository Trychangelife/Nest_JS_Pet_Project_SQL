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
exports.Blogs = exports.nameRegex = exports.websiteUrlRegex = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
exports.websiteUrlRegex = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;
exports.nameRegex = /^[a-zA-Zа-яА-Я\s-]+$/;
class Blogs {
}
exports.Blogs = Blogs;
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => value === null || value === void 0 ? void 0 : value.trim()),
    (0, class_validator_1.Matches)(exports.nameRegex),
    (0, class_validator_1.Length)(1, 15),
    __metadata("design:type", String)
], Blogs.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.Matches)(exports.websiteUrlRegex),
    (0, class_validator_1.Length)(1, 100),
    __metadata("design:type", String)
], Blogs.prototype, "websiteUrl", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => value === null || value === void 0 ? void 0 : value.trim()),
    (0, class_validator_1.Length)(1, 500),
    __metadata("design:type", String)
], Blogs.prototype, "description", void 0);
//# sourceMappingURL=Blog_validator_type.js.map