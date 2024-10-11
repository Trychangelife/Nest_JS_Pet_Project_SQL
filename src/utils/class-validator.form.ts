import { IsEnum } from "class-validator"
import { LIKES } from "./types"

// export const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
// export const loginRegex = /^[a-zA-Z0-9_-]*$/
// export const websiteUrlRegex = /^https:\/\/([a-zA-Z0-9_-]+\.)+[a-zA-Z0-9_-]+(\/[a-zA-Z0-9_-]+)*\/?$/;
// export const nameRegex = /^[a-zA-Zа-яА-Я\s-]+$/;

export class LikesDTO {
    @IsEnum(LIKES)
    likeStatus: string
}

