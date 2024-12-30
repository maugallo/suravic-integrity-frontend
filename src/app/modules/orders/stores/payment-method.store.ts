import { inject } from "@angular/core";
import { patchState, signalStore, withHooks, withMethods, withState } from "@ngrx/signals";
import { PaymentMethodService } from "../services/payment-method.service";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { pipe, switchMap } from "rxjs";
import { tapResponse } from "@ngrx/operators";
import { HttpErrorResponse } from "@angular/common/http";
import { setCompleted, setError, withRequestStatus } from "src/app/shared/store/request.feature";
import { PaymentMethod } from "../models/payment-method.model";

const initialState: PaymentMethodState = {
    paymentMethods: []
}

export const PaymentMethodStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withRequestStatus(),
    withMethods((store, service = inject(PaymentMethodService)) => ({
        getPaymentMethods: rxMethod<void>(pipe(
            switchMap(() => service.getPaymentMethods().pipe(
                tapResponse({
                    next: (paymentMethods) => patchState(store, { paymentMethods }),
                    error: (error: HttpErrorResponse) => patchState(store, setError(error.message)),
                    finalize: () => patchState(store, setCompleted())
                })
            ))
        ))
    })),
    withHooks((store) => ({
        onInit: () => {
            store.getPaymentMethods();
        }
    }))
);

interface PaymentMethodState {
    paymentMethods: PaymentMethod[]
}