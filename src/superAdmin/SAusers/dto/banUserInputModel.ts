import { IsNotEmpty, Length, MinLength } from "class-validator";



export class BanUserInputModel {
    @IsNotEmpty()
    isBanned: boolean;

    @MinLength(20)
    banReason: string;
}