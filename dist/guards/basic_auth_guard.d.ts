import { CanActivate, ExecutionContext } from "@nestjs/common";
export declare class BasicAuthGuard implements CanActivate {
    constructor();
    canActivate(context: ExecutionContext): Promise<boolean>;
}
