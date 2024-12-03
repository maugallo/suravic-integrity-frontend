import { Photo } from "@capacitor/camera";
import { UserResponse } from "src/app/modules/users/models/user.model";

export interface OperationRequest {
    creditAccountId: number,
    userId: number,
    type: string,
    total: number,
    receipt: Photo | undefined
}

export interface OperationResponse {
    id: number,
    creditAccount: CreditAccountResponse,
    user: UserResponse,
    type: string,
    total: number,
    receipt: string
}

export interface CreditAccountResponse {
    id: number,
    balance: number
}