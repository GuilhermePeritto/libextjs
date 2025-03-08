export interface UserInput {
    name: string;
    email: string;
    password: string;
}

export interface UserResponse {
    _id: string;
    name: string;
    email: string;
    createdAt: Date;
}