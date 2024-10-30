import { CommandHandler } from "@nestjs/cqrs"
import { PostRepository } from "src/posts/repositories/posts.repository"
import { PostsRepositorySql } from "src/posts/repositories/posts.sql.repository"


export class DeletePostByBloggerCommand {
    constructor(
        public blogId: string,
        public postId: string) {
        
    }
}

@CommandHandler(DeletePostByBloggerCommand)
export class DeletePostByBloggerUseCase {
    constructor (protected postsRepository: PostsRepositorySql ) {}

    // async execute(command: DeletePostByBloggerCommand): Promise<boolean> {
    //         return await this.postsRepository.deletePost(command.blogId, command.postId)

    //     }
}

