import { OrderRequest } from "../interfaces/order.model";
import { ProductRequest } from "../interfaces/product.model";
import { ProviderRequest } from "../interfaces/provider.model";

export class EntitiesUtility {

    public static getEmptyProductRequest(): ProductRequest {
        return {
            categoryId: -1,
            providerId: -1,
            plu: '',
            title: '',
            price: ''
        }
    }

    public static getEmptyProviderRequest(): ProviderRequest {
        return {
            sectorId: -1,
            contact: { email: '', telephone: '' },
            percentages: { profitPercentage: '', vatPercentage: '', perceptionPercentage: '', grossIncomePercentage: '' },
            vatCondition: '',
            companyName: '',
            firstName: '',
            lastName: '',
            cuit: ''
        }
    }

    public static getEmptyOrderRequest(): OrderRequest {
        return {
            providerId: -1,
            userId: -1,
            status: '',
            paymentMethodIds: [],
            deliveryDate: new Date().toISOString(),
            total: '',
            invoice: undefined,
            paymentReceipt: undefined
        }
    }

}