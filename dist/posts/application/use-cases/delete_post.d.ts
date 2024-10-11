import { PostRepository } from "src/posts/repositories/posts.repository";
export declare class DeletePostCommand {
    deleteId: string;
    constructor(deleteId: string);
}
export declare class DeletePostUseCase {
    protected postsRepository: PostRepository;
    constructor(postsRepository: PostRepository);
    execute(command: DeletePostCommand): Promise<boolean>;
}
