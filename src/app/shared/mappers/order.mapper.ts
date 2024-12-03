import { OrderRequest, OrderResponse } from "src/app/modules/orders/models/order.model"

export class OrderMapper {

    public static toOrderRequest(order: OrderResponse): OrderRequest {
        return {
            providerId: order.provider.id,
            userId: order.user.id,
            status: order.status,
            paymentMethodIds: order.paymentMethods.map(paymentMethod => paymentMethod.id),
            deliveryDate: order.deliveryDate,
            total: order.total,
            invoice: undefined,
            paymentReceipt: undefined
        }
    }

}