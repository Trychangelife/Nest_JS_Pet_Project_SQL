import { CommandHandler } from "@nestjs/cqrs"
import { BlogsRepository } from "src/blogs/repositories/blogs.repository"


export class GetTargetBlogCommand {
    constructor(
        public blogId: string,
        public userId?: string) {
        
    }
}

@CommandHandler(GetTargetBlogCommand)
export class GetTargetBlogUseCase {
    constructor (protected bloggerRepository: BlogsRepository ) {}


    async execute(command: GetTargetBlogCommand): Promise<object | undefined> {

        return this.bloggerRepository.targetBloggers(command.blogId, command.userId)
    }
}


