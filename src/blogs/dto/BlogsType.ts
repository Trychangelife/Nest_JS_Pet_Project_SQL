export type BlogsType = {
    id: string;
    name: string;
    description: string;
    websiteUrl: string;
    createdAt: string;
    isMembership: boolean;
    blogOwnerInfo: {
        userId: string,
        userLogin: string
    }
};
