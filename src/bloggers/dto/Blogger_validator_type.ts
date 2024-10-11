import { Matches, Length } from "class-validator";
import { Transform, TransformFnParams } from "class-transformer";

export const websiteUrlRegex = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;
export const nameRegex = /^[a-zA-Zа-яА-Я\s-]+$/;

export class Blogs {
    @Transform(({ value }: TransformFnParams) => value?.trim())
    @Matches(nameRegex)
    @Length(1, 15)
    name: string;

    @Matches(websiteUrlRegex)
    @Length(1, 100)
    websiteUrl: string;

    @Transform(({ value }: TransformFnParams) => value?.trim())
    @Length(1, 500)
    description: string;
}
