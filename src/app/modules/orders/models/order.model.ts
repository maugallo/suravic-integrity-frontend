import { Photo } from "@capacitor/camera"
import { ProviderResponse } from "src/app/modules/providers/models/provider.model"
import { UserResponse } from "src/app/modules/users/models/user.model"
import { PaymentMethod } from "./payment-method.model"
import { BaseEntity } from "src/app/shared/models/base-entity.model"

export interface OrderRequest extends BaseEntity {
    providerId: number,
    userId: number,
    status: string,
    paymentMethodIds: number[],
    deliveryDate: string,
    total: string,
    invoice: File | Photo | undefined,
    paymentReceipt: File | Photo | undefined
}

export interface OrderResponse extends BaseEntity {
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