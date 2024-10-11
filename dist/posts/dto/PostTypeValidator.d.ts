export declare class PostTypeValidator {
    id: string;
    title: string;
    shortDescription: string;
    content: string;
    userId: string;
    blogId: string;
}
export declare class PostTypeValidatorForCreate extends PostTypeValidator {
    blogId: string;
}
