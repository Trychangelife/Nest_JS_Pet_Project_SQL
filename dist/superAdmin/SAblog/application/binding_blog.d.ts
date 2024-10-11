import { CommandBus } from "@nestjs/cqrs";
import { BlogsSuperAdminRepository } from "../repositories/blogs.SA.repository";
export declare class BindingBlogSuperAdminCommand {
    blogId: string;
    userId: string;
    constructor(blogId: string, userId: string);
}
export declare class BindingBlogSuperAdminUseCase {
    protected blogsSuperAdminRepository: BlogsSuperAdminRepository;
    commandBus: CommandBus;
    constructor(blogsSuperAdminRepository: BlogsSuperAdminRepository, commandBus: CommandBus);
    execute(command: BindingBlogSuperAdminCommand): Promise<boolean>;
}
