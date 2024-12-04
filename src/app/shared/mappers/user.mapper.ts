import { UserRequest, UserResponse } from "src/app/modules/users/models/user.model"

export class UserMapper {

    public static toUserRequest(user: UserResponse): UserRequest {
        return {
            username: user.username,
            password: '',
            role: user.role
        }
    }

}