import { CommandHandler } from "@nestjs/cqrs"
import { BlogsSuperAdminRepository } from "../repositories/blogs.SA.repository"


export class GetAllBlogsSuperAdminCommand {
    constructor(public pageSize: number, public pageNumber: number, public searchNameTerm?: string | null, public sortBy?: string, public sortDirection?: string) {
        
    }
}

@CommandHandler(GetAllBlogsSuperAdminCommand)
export class GetAllBlogsSuperAdminUseCase {
    constructor (protected blogsSuperAdminRepository: BlogsSuperAdminRepository ) {}

    async execute(command: GetAllBlogsSuperAdminCommand): Promise<object> {
        let skip = 0
        if (command.pageNumber && command.pageSize) {
            skip = (command.pageNumber - 1) * command.pageSize
        }
        const blogs = await this.blogsSuperAdminRepository.getAllBlogs(skip, command.pageSize, command.searchNameTerm, command.pageNumber, command.sortBy, command.sortDirection)
        return blogs
    }
}


