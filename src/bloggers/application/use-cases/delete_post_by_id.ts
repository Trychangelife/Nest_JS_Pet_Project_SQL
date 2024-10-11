import { CommandHandler } from "@nestjs/cqrs"
import { PostRepository } from "src/posts/repositories/posts.repository"


export class DeletePostByBloggerCommand {
    constructor(
        public blogId: string,
        public postId: string) {
        
    }
}

@CommandHandler(DeletePostByBloggerCommand)
export class DeletePostByBloggerUseCase {
    constructor (protected postsRepository: PostRepository ) {}

    async execute(command: DeletePostByBloggerCommand): Promise<boolean> {
            return await this.postsRepository.deletePost(command.blogId, command.postId)

        }
}

