import { UsersType } from "src/users/dto/UsersType";

declare global {
    namespace Express {
        export interface Request {
            user: UsersType | null
        }
    }
}

