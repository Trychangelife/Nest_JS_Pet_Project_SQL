import { CommandHandler } from "@nestjs/cqrs"
import { PostRepository } from "src/posts/repositories/posts.repository"
import { PostsRepositorySql } from "src/posts/repositories/posts.sql.repository"


export class DeletePostCommand {
    constructor(
        public deletePostId: string,
        public blogId: string
        ) {
        
    }
}

@CommandHandler(DeletePostCommand)
export class DeletePostUseCase {
    constructor (protected postsRepository: PostsRepositorySql ) {}

    async execute(command: DeletePostCommand): Promise<boolean> {
            return await this.postsRepository.deletePost(command.deletePostId, command.blogId)
    
        }
}

