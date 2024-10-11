import { UsersType } from "../users/dto/UsersType";

declare global {
    namespace Express {
        export interface Request {
            user: UsersType | null
        }
    }
}

