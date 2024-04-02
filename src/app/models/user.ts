export class User{
    constructor(
        public id: number,
        public role: string,
        public name: string,
        public surname: string,
        public nick: string,
        public email: string,
        public password: string,
        public avatar: string
    ){}
}