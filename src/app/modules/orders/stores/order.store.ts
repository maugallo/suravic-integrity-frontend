import { BaseState, withCrudOperations } from "src/app/shared/store/crud.feature";
import { OrderResponse } from "../models/order.model";
import { OrderService } from "../services/order.service";
import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { pipe, switchMap } from "rxjs";
import { inject } from "@angular/core";
import { tapResponse } from "@ngrx/operators";
import { HttpErrorResponse } from "@angular/common/http";
import { setCompleted, setError } from "src/app/shared/store/request.feature";

const initialState: OrderState = {
    entities: [],
    lastUpdatedEntity: undefined,
    invoice: new Blob(),
    paymentReceipt: null
}

export const OrderStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withCrudOperations<FormData, OrderResponse>(OrderService),
    withMethods((store, service = inject(OrderService)) => ({
        getInvoiceFile: rxMethod<number>(pipe(
            switchMap((id) => service.getInvoiceFile(id).pipe(
                tapResponse({
                    next: (invoice) => patchState(store, { invoice }),
                    error: (error: HttpErrorResponse) => patchState(store, setError(error.message)),
                    finalize: () => patchState(store, setCompleted())
                })
            ))
        )),
        getPaymentReceiptFile: rxMethod<number>(pipe(
            switchMap((id) => service.getPaymentReceiptFile(id).pipe(
                tapResponse({
                    next: (paymentReceipt) => patchState(store, { paymentReceipt }),
                    error: (error: HttpErrorResponse) => patchState(store, setError(error.message)),
                    finalize: () => patchState(store, setCompleted())
                })
            ))
        ))
    }))
);

interface OrderState extends BaseState<OrderResponse> {
    invoice: Blob,
    paymentReceipt: Blob | null
}