import { MaxLength, Matches, Validate, Length } from "class-validator";
import { Transform, TransformFnParams } from "class-transformer";
import { BlogIsExistRule } from "../validator.posts.form";

const nameRegex = /^[a-zA-Zа-яА-Я\s-]+$/;

export class PostTypeValidator {
    id: string;
    @Length(1,30)
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @Matches(nameRegex)
    title: string;
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @Length(1,100)
    @Matches(nameRegex)
    shortDescription: string;
    @Length(1,1000)
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @Matches(nameRegex)
    content: string;
    userId: string;
    blogId: string;

}
// Наследование класса для прохождения тестов
export class PostTypeValidatorForCreate extends PostTypeValidator {
    @Validate(BlogIsExistRule, { message: "BlogId not exist" })
    blogId: string;
}
