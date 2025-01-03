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
import { Photo } from "@capacitor/camera";
import { FileUtility } from "src/app/shared/utils/file.utility";

const initialState: OrderState = {
    entities: [],
    lastUpdatedEntity: undefined,
    invoice: undefined,
    paymentReceipt: undefined
}

export const OrderStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withCrudOperations<FormData, OrderResponse>(OrderService),
    withMethods((store, service = inject(OrderService)) => ({
        getInvoiceFile: rxMethod<number>(pipe(
            switchMap((id) => service.getInvoiceFile(id).pipe(
                tapResponse({
                    next: async (invoice) => patchState(store, { invoice: await parseFile(invoice, 'archivo') }),
                    error: (error: HttpErrorResponse) => patchState(store, setError(error.message)),
                    finalize: () => patchState(store, setCompleted())
                })
            ))
        )),
        getPaymentReceiptFile: rxMethod<number>(pipe(
            switchMap((id) => service.getPaymentReceiptFile(id).pipe(
                tapResponse({
                    next: async (paymentReceipt) => patchState(store, { paymentReceipt: await parseFile(paymentReceipt, 'archivo') }),
                    error: (error: HttpErrorResponse) => patchState(store, setError(error.message)),
                    finalize: () => patchState(store, setCompleted())
                })
            ))
        ))
    }))
);

async function parseFile(file: Blob | undefined, text: string): Promise<File | Photo | undefined> {
    if (file && file.size > 0) {
        if (file.type.startsWith('image/')) return FileUtility.getPhotoFromBlob(file);
        else return FileUtility.getFileFromBlob(file, text);
    }
    return undefined;
}

interface OrderState extends BaseState<OrderResponse> {
    invoice: File | Photo | undefined,
    paymentReceipt: File | Photo | undefined
}