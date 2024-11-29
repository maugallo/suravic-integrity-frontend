import { UserResponse } from "src/app/users/models/user.model"

export class UserMapper {

    public static toUserRequest(user: UserResponse) {
        return {
            username: user.username,
            password: '',
            role: user.role
        }
    }

}