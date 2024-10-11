import { PostRepository } from "src/posts/repositories/posts.repository";
export declare class UpdatePostCommand {
    postId: string;
    title: string;
    shortDescription: string;
    content: string;
    bloggerId: string;
    constructor(postId: string, title: string, shortDescription: string, content: string, bloggerId: string);
}
export declare class UpdatePostUseCase {
    protected postsRepository: PostRepository;
    constructor(postsRepository: PostRepository);
    execute(command: UpdatePostCommand): Promise<string | object>;
}
