import { OperationRequest, OperationResponse } from "../interfaces/operation.model";

export class OperationMapper {

    public static toOperationRequest(operation: OperationResponse): OperationRequest {
        return {
            creditAccountId: operation.creditAccount.id,
            userId: operation.user.id,
            total: operation.total,
            type: operation.type,
            receipt: undefined
        }
    }

}