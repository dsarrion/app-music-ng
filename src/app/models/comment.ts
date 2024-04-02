export class Comment{
    constructor(
        public id: number,
        public user_id: number,
        public track_id: number,
        public content: string
    ){}
}