import { CommandHandler } from "@nestjs/cqrs"
import { PostRepository } from "src/posts/repositories/posts.repository"
import { PostsRepositorySql } from "src/posts/repositories/posts.sql.repository"


export class UpdatePostCommand {
    constructor(
        public postId: string, 
        public title: string, 
        public shortDescription: string, 
        public content: string, 
        public bloggerId: string) {
        
    }
}

@CommandHandler(UpdatePostCommand)
export class UpdatePostUseCase {
    constructor (protected postsRepository: PostsRepositorySql ) {}

    // async execute(command: UpdatePostCommand): Promise<string | object> {

    //     return await this.postsRepository.changePost(command.postId, command.title, command.shortDescription, command.content, command.bloggerId)
    // }
}

