import { Photo } from "@capacitor/camera"
import { ProviderResponse } from "./provider.model"
import { UserResponse } from "./user.model"

export interface OrderRequest {
    providerId: number,
    userId: number,
    status: string,
    paymentMethod: string[],
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
    paymentMethod: string[],
    deliveryDate: string,
    total: string,
    invoice: File,
    paymentReceipt: File
}