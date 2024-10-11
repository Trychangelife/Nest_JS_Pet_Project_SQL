import { MinLength, MaxLength, IsOptional, Matches, IsNotEmpty } from "class-validator";

const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/
const loginRegex = /^[a-zA-Z0-9_-]*$/


export class AuthForm {
    @MinLength(3)
    @MaxLength(10)
    @IsOptional()
    login: string;
    @MinLength(6)
    @MaxLength(20)
    @Matches(loginRegex)
    password: string;
    @IsNotEmpty()
    @IsOptional()
    @Matches(emailRegex)
    email: string;
    loginOrEmail: string;
}
