import { CanActivate, ExecutionContext } from "@nestjs/common";
import { UsersService } from "src/users/application/users.service";
import { JwtServiceClass } from "./jwt.service";
export declare class JwtAuthGuard implements CanActivate {
    protected jwtServiceClass: JwtServiceClass;
    protected usersService: UsersService;
    constructor(jwtServiceClass: JwtServiceClass, usersService: UsersService);
    canActivate(context: ExecutionContext): Promise<boolean>;
}
