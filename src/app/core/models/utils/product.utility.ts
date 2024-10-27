import { ProductRequest } from "../interfaces/product.model";

export class ProductUtility {

    public static getEmptyProductRequest(): ProductRequest {
        return {
            categoryId: -1,
            providerId: -1,
            userId: -1,
            plu: '',
            title: '',
            price: ''
        }
    }

}