import { CommandHandler } from "@nestjs/cqrs"
import { PostRepository } from "src/posts/repositories/posts.repository"

export class GetCommentByPostIdCommand {
    constructor(
        public postId: string, 
        public page: number, 
        public pageSize: number, 
        public userId?: string, 
        public sortBy?: string, 
        public sortDirection?: string) {

    }
}

@CommandHandler(GetCommentByPostIdCommand)
export class GetCommentByPostIdUseCase {
    constructor(protected postsRepository: PostRepository) { }

    async execute(command: GetCommentByPostIdCommand): Promise<object | boolean> {
        let skip = 0
        if (command.page && command.pageSize) {
            skip = (command.page - 1) * command.pageSize
        }
        return await this.postsRepository.takeCommentByIdPost(command.postId, skip, command.pageSize, command.page, command.userId, command.sortBy, command.sortDirection)
    }
}

