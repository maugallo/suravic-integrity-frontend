import { CategoryResponse } from "./category.model";
import { ProviderResponse } from "./provider.model";
import { UserResponse } from "./user.model";

export interface ProductRequest {
    categoryId: number,
    providerId: number,
    userId: number,
    plu: string,
    title: string,
    price: string
}

export interface ProductResponse {
    id: number,
    category: CategoryResponse,
    provider: ProviderResponse,
    user: UserResponse,
    plu: string,
    title: string,
    price: string,
    isEnabled: boolean
}