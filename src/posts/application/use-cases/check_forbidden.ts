import { CommandHandler } from "@nestjs/cqrs"
import { PostsType } from "src/posts/dto/PostsType"
import { PostRepository } from "src/posts/repositories/posts.repository"


export class CheckForbiddenCommand {
    constructor(
        public postId: string, 
        public userId: string,
        ) {
        
    }
}

@CommandHandler(CheckForbiddenCommand)
export class CheckForbiddenUseCase {
    constructor (protected postsRepository: PostRepository ) {}

    async execute(command: CheckForbiddenCommand): Promise<boolean> {
       // console.log(command.postId)
        const foundPost: PostsType = await this.postsRepository.targetPosts(command.postId, null,"full")
        if (foundPost?.authorUserId === command.userId) {
            //console.log(foundPost?.authorUserId, command.userId)
            return true
        }
        else {
            return false
        }
    }
}

