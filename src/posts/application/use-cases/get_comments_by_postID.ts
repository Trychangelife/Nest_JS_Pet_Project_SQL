import { CommandHandler } from "@nestjs/cqrs"
import { PostsRepositorySql } from "src/posts/repositories/posts.sql.repository"

export class GetCommentByPostIdCommand {
    constructor(
        public postId: string, 
        public page: number, 
        public pageSize: number,  
        public sortBy?: string, 
        public sortDirection?: string,
        public userId?: number) {

    }
}

@CommandHandler(GetCommentByPostIdCommand)
export class GetCommentByPostIdUseCase {
    constructor(protected postsRepository: PostsRepositorySql) { }

    async execute(command: GetCommentByPostIdCommand): Promise<object | boolean> {
        let skip = 0
        if (command.page && command.pageSize) {
            skip = (command.page - 1) * command.pageSize
        }
        return await this.postsRepository.takeCommentByIdPost(command.postId, skip, command.pageSize, command.page, command.sortBy, command.sortDirection, command.userId)
    }
}

