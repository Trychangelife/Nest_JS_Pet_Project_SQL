import { CommandHandler } from "@nestjs/cqrs"
import { BlogsRepositorySql } from "src/blogs/repositories/blogs.sql.repository"


export class GetAllBlogsforBloggerCommand {
    constructor(public pageSize: number, public pageNumber: number, public searchNameTerm?: string | null, public sortBy?: string, public sortDirection?: string, public userId?: string) {
        
    }
}

@CommandHandler(GetAllBlogsforBloggerCommand)
export class GetAllBlogsforBloggerUseCase {
    constructor (protected bloggerRepository: BlogsRepositorySql ) {}

    // async execute(command: GetAllBlogsforBloggerCommand): Promise<object> {
    //     let skip = 0
    //     if (command.pageNumber && command.pageSize) {
    //         skip = (command.pageNumber - 1) * command.pageSize
    //     }
    //     const blogs = await this.bloggerRepository.getAllBlogsForSpecificBlogger(skip, command.pageSize, command.searchNameTerm, command.pageNumber, command.sortBy, command.sortDirection, command.userId)
    //     return blogs
    // }
}


