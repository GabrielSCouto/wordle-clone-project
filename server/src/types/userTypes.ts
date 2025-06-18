export interface UserCreateData {
    name: string;
    email: string;
    password: string;
}

export interface UserUpdateData {
    name?: string;
    email?: string;
    password?: string;
}