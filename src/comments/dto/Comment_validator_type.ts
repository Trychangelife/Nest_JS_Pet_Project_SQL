import { MinLength, MaxLength } from "class-validator";

export class Comment {
    @MinLength(20)
    @MaxLength(300)
    content: string;

}
