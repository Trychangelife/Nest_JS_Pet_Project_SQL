export type BlogsType = {
    id: number;
    name: string;
    description: string;
    website_url: string;
    created_at: Date;
    is_membership: boolean;
    owner_user_id: number;
    owner_user_login: string;
};

export type BlogsTypeView = {
    id: string,
    name: string,
    description: string
    websiteUrl: string,
    createdAt: Date,
    isMembership: boolean
}