import { CommandHandler } from "@nestjs/cqrs"
import { PostsType } from "src/posts/dto/PostsType"
import { PostsRepositorySql } from "src/posts/repositories/posts.sql.repository"


export class CheckForbiddenCommand {
    constructor(
        public postId: string, 
        public userId: number,
        ) {
        
    }
}

@CommandHandler(CheckForbiddenCommand)
export class CheckForbiddenUseCase {
    constructor (protected postsRepository: PostsRepositorySql ) {}

    // async execute(command: CheckForbiddenCommand): Promise<boolean> {
    //    // console.log(command.postId)
    //     const foundPost: PostsType = await this.postsRepository.targetPosts(command.postId, null,"full")
    //     if (foundPost?.authorUserId === command.userId) {
    //         //console.log(foundPost?.authorUserId, command.userId)
    //         return true
    //     }
    //     else {
    //         return false
    //     }
    // }
}

