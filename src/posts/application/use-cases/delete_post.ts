import { CommandHandler } from "@nestjs/cqrs"
import { PostRepository } from "src/posts/repositories/posts.repository"


export class DeletePostCommand {
    constructor(
        public deleteId: string) {
        
    }
}

@CommandHandler(DeletePostCommand)
export class DeletePostUseCase {
    constructor (protected postsRepository: PostRepository ) {}

    async execute(command: DeletePostCommand): Promise<boolean> {
            return await this.postsRepository.deletePost(command.deleteId)
    
        }
}

