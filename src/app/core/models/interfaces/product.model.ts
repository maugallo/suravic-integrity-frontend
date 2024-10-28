import { CategoryResponse } from "./category.model";
import { ProviderResponse } from "./provider.model";

export interface ProductRequest {
    categoryId: number,
    providerId: number,
    plu: string,
    title: string,
    price: string
}

export interface ProductResponse {
    id: number,
    category: CategoryResponse,
    provider: ProviderResponse,
    plu: string,
    title: string,
    price: string,
    isEnabled: boolean
}

export interface ProductWithPricing {
    id: number,
    category: CategoryResponse,
    provider: ProviderResponse,
    plu: string,
    title: string,
    price: string,
    isEnabled: boolean,
    quantity: number,
    subtotal: number,
    vatPercentage: number,
    profitPercentage: number
}

export interface ProductWithMeatDetails {
    id: number,
    plu: string,
    title: string,
    price: string,
    percentage: number,
    weight: number
}