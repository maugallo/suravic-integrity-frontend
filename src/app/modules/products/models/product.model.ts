import { CategoryResponse } from "src/app/modules/categories/models/category.model";
import { ProviderResponse } from "src/app/modules/providers/models/provider.model";
import { BaseEntity } from "src/app/shared/models/base-entity.model";

export interface ProductRequest extends BaseEntity {
    categoryId: number,
    providerId: number,
    plu: string,
    title: string,
    price: string
}

export interface ProductResponse extends BaseEntity {
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