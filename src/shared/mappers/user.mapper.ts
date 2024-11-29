import { UserResponse } from "../interfaces/user.model";

export class UserMapper {

    public static toUserRequest(user: UserResponse) {
        return {
            username: user.username,
            password: '',
            role: user.role
        }
    }

}