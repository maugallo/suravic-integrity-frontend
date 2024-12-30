import { BaseEntity } from "src/app/shared/models/base-entity.model"

export interface UserLoginRequest {
    username: string,
    password: string
}

export interface UserRequest extends BaseEntity {
    username: string,
    password: string,
    role: string
}

export interface UserResponse extends BaseEntity {
    id: number,
    username: string,
    role: string,
    isEnabled: boolean
}