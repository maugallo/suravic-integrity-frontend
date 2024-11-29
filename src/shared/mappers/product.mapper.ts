import { ProductRequest, ProductResponse, ProductWithPricing } from "src/app/products/models/product.model";

export class ProductMapper {

    public static toProductWithPricing(product: ProductResponse): ProductWithPricing {
        return { ...product, quantity: 0, subtotal: 0, vatPercentage: Number(product.provider.percentages.vatPercentage), profitPercentage: Number(product.provider.percentages.profitPercentage) };
    }

    public static toProductResponse(product: ProductWithPricing): ProductResponse {
        return { ...(({ subtotal, quantity, vatPercentage, profitPercentage, ...rest }) => rest)(product) }
    }

    public static toProductRequest(product: ProductResponse): ProductRequest {
        return {
            categoryId: product.category.id,
            providerId: product.provider.id,
            plu: product.plu,
            title: product.title,
            price: product.price
        }
    }

}