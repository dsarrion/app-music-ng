export interface User {
    id: number,
    role: string,
    name: string,
    surname: string,
    nick: string,
    email: string, 
    avatar?: string,
    created_at?: Date
}