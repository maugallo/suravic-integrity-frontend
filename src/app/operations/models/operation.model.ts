import { Photo } from "@capacitor/camera";
import { CreditAccountResponse } from "./account.model";
import { UserResponse } from "./user.model";

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