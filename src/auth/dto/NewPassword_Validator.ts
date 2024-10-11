import { MinLength, MaxLength } from "class-validator";




export class NewPassword {
    @MinLength(6)
    @MaxLength(20)
    newPassword: string;
    recoveryCode: string;
}
