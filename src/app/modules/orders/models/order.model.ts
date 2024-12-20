import { Photo } from "@capacitor/camera"
import { ProviderResponse } from "src/app/modules/providers/models/provider.model"
import { UserResponse } from "src/app/modules/users/models/user.model"
import { PaymentMethod } from "./payment-method.model"

export interface OrderRequest {
    providerId: number,
    userId: number,
    status: string,
    paymentMethodIds: number[],
    deliveryDate: string,
    total: string,
    invoice: File | Photo | undefined,
    paymentReceipt: File | Photo | undefined
}

export interface OrderResponse {
    id: number,
    provider: ProviderResponse,
    user: UserResponse,
    status: string,
    paymentMethods: PaymentMethod[],
    deliveryDate: string,
    total: string,
    invoice: string,
    paymentReceipt: string,
    isEnabled: boolean
}