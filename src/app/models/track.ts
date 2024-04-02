export class Track{
    constructor(
        public id: number,
        public category_id: number,
        public title: string,
        public dj: string,
        public description: string,
        public url: string
    ){}
}