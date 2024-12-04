import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { ProviderResponse } from "../models/provider.model";
import { setCompleted, setError, withRequestStatus } from "src/app/shared/store/request.feature";
import { inject } from "@angular/core";
import { ProviderService } from "../services/provider.service";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { pipe, switchMap } from "rxjs";
import { tapResponse } from "@ngrx/operators";
import { HttpErrorResponse } from "@angular/common/http";

const initialState: ProvidersState = {
    providers: []
}

export const ProviderStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withRequestStatus(),
    withMethods((store, providerService = inject(ProviderService)) => ({
        getProviders: rxMethod<void>(pipe(
            switchMap(() => providerService.getProviders().pipe(
                tapResponse({
                    next: (providers) => patchState(store, { providers }),
                    error: (error: HttpErrorResponse) => patchState(store, setError(error.message)),
                    finalize: () => patchState(store, setCompleted())
                })
            ))
        ))
    }))
);


interface ProvidersState {
    providers: ProviderResponse[]
};