import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { UsersService } from "src/users/application/users.service";
import { JwtServiceClass } from "./jwt.service";
import { UsersType } from "src/users/dto/UsersType";


@Injectable()
export class JwtAuthGuard implements CanActivate {

    
    constructor (
                protected jwtServiceClass: JwtServiceClass,
                protected usersService: UsersService) {}
    async canActivate(context: ExecutionContext): Promise<boolean> {
        try {
            const req = context.switchToHttp().getRequest()
            const bearer = req.headers.authorization.split(' ')[0]
            const token = req.headers.authorization.split(' ')[1]
            if (bearer !== "Bearer" || !token) {
                throw new UnauthorizedException(401)
            }
            const userId = await this.jwtServiceClass.getUserByAccessToken(token)
            if (userId) {
                const user: UsersType =  await this.usersService.findUserById(userId)
                req.user = user;
                return true
            }
            else {
                throw new UnauthorizedException(401)
            }
        } 
        catch (e) { 
            throw new UnauthorizedException(401)
        } 
} 
}