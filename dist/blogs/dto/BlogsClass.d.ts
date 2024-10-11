export declare class BlogsClass {
    id: string;
    name: string;
    description: string;
    websiteUrl: string;
    createdAt: string;
    isMembership: boolean;
    blogOwnerInfo: {
        userId: string;
        userLogin: string;
    };
    constructor(id: string, name: string, description: string, websiteUrl: string, createdAt: string, isMembership: boolean, blogOwnerInfo: {
        userId: string;
        userLogin: string;
    });
}
