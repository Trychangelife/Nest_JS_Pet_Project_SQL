import { IsOptional, Matches, IsNotEmpty } from "class-validator";

const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/


export class EmailForRecoveryPassword {
    @IsNotEmpty()
    @IsOptional()
    @Matches(emailRegex)
    email: string;
}
