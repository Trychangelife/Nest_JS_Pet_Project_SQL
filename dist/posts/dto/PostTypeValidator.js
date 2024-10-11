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
exports.PostTypeValidatorForCreate = exports.PostTypeValidator = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const validator_posts_form_1 = require("../validator.posts.form");
const nameRegex = /^[a-zA-Zа-яА-Я\s-]+$/;
class PostTypeValidator {
}
exports.PostTypeValidator = PostTypeValidator;
__decorate([
    (0, class_validator_1.Length)(1, 30),
    (0, class_transformer_1.Transform)(({ value }) => value === null || value === void 0 ? void 0 : value.trim()),
    (0, class_validator_1.Matches)(nameRegex),
    __metadata("design:type", String)
], PostTypeValidator.prototype, "title", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => value === null || value === void 0 ? void 0 : value.trim()),
    (0, class_validator_1.Length)(1, 100),
    (0, class_validator_1.Matches)(nameRegex),
    __metadata("design:type", String)
], PostTypeValidator.prototype, "shortDescription", void 0);
__decorate([
    (0, class_validator_1.Length)(1, 1000),
    (0, class_transformer_1.Transform)(({ value }) => value === null || value === void 0 ? void 0 : value.trim()),
    (0, class_validator_1.Matches)(nameRegex),
    __metadata("design:type", String)
], PostTypeValidator.prototype, "content", void 0);
class PostTypeValidatorForCreate extends PostTypeValidator {
}
exports.PostTypeValidatorForCreate = PostTypeValidatorForCreate;
__decorate([
    (0, class_validator_1.Validate)(validator_posts_form_1.BlogIsExistRule, { message: "BlogId not exist" }),
    __metadata("design:type", String)
], PostTypeValidatorForCreate.prototype, "blogId", void 0);
//# sourceMappingURL=PostTypeValidator.js.map