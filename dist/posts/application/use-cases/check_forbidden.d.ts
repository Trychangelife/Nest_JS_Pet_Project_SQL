import { PostRepository } from "src/posts/repositories/posts.repository";
export declare class CheckForbiddenCommand {
    postId: string;
    userId: string;
    constructor(postId: string, userId: string);
}
export declare class CheckForbiddenUseCase {
    protected postsRepository: PostRepository;
    constructor(postsRepository: PostRepository);
    execute(command: CheckForbiddenCommand): Promise<boolean>;
}
