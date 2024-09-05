export interface UserLoginRequest {
    username: string,
    password: string
}

export interface UserRequest {
    username: string,
    password: string,
    role: string
}

export interface UserResponse {
    id: number,
    username: string,
    role: string,
    isEnabled: boolean
}