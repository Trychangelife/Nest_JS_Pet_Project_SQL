import { PostRepository } from "src/posts/repositories/posts.repository";
export declare class DeletePostByBloggerCommand {
    blogId: string;
    postId: string;
    constructor(blogId: string, postId: string);
}
export declare class DeletePostByBloggerUseCase {
    protected postsRepository: PostRepository;
    constructor(postsRepository: PostRepository);
    execute(command: DeletePostByBloggerCommand): Promise<boolean>;
}
