
export class BlogsClass {
    constructor(
        public id: number, 
        public name: string, 
        public description: string, 
        public website_url: string, 
        public created_at: string, 
        public is_membership: boolean,
        public owner_user_id: number,
        public owner_user_login: string
        ) {
    }
}
