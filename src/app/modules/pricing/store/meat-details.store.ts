import { inject } from "@angular/core";
import { patchState, signalStore, withHooks, withMethods, withState } from "@ngrx/signals";
import { MeatDetailsService } from "../services/meat-details.service";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { pipe, switchMap } from "rxjs";
import { tapResponse } from "@ngrx/operators";
import { setCompleted, setError, setSuccess, withRequestStatus } from "src/app/shared/store/request.feature";
import { ProductWithMeatDetails } from "../../products/models/product.model";
import { HttpErrorResponse } from "@angular/common/http";
import { MeatDetailsType } from "../models/meat-details-type.enum";
import { MeatDetailsConstant } from "../models/meat-details-constant.enum";

const initialState: MeatDetailsState = {
    beefEntities: [],
    chickenEntities: [],
    halfCarcassWeight: MeatDetailsConstant.DEFAULT_HALF_CARCASS_WEIGHT,
    chickenWeight: MeatDetailsConstant.DEFAULT_CHICKEN_WEIGHT
}

export const MeatDetailsStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withRequestStatus(),
    withMethods((store, service = inject(MeatDetailsService)) => ({
        getBeefEntities: rxMethod<void>(pipe(
            switchMap(() => service.getMeatDetails(MeatDetailsType.BEEF).pipe(
                tapResponse({
                    next: (meatDetails) => patchState(store, { beefEntities: meatDetails }),
                    error: (error: HttpErrorResponse) => patchState(store, setError(error.message)),
                    finalize: () => patchState(store, setCompleted())
                })
            ))
        )),
        getChickenEntities: rxMethod<void>(pipe(
            switchMap(() => service.getMeatDetails(MeatDetailsType.CHICKEN).pipe(
                tapResponse({
                    next: (meatDetails) => patchState(store, { chickenEntities: meatDetails }),
                    error: (error: HttpErrorResponse) => patchState(store, setError(error.message)),
                    finalize: () => patchState(store, setCompleted())
                })
            ))
        )),

        editBeefEntities: rxMethod<ProductWithMeatDetails[]>(pipe(
            switchMap((entities) => service.editMeatDetails(entities).pipe(
                tapResponse({
                    next: (editedMeatDetails) => {
                        patchState(store, { beefEntities: editedMeatDetails });
                        setSuccess("Modificados correctamente!");
                    },
                    error: (error: HttpErrorResponse) => patchState(store, setError(error.message)),
                    finalize: () => patchState(store, setCompleted())
                })
            ))
        )),
        editChickenEntities: rxMethod<ProductWithMeatDetails[]>(pipe(
            switchMap((entities) => service.editMeatDetails(entities).pipe(
                tapResponse({
                    next: (editedMeatDetails) => {
                        patchState(store, { chickenEntities: editedMeatDetails });
                        setSuccess("Modificados correctamente!");
                    },
                    error: (error: HttpErrorResponse) => patchState(store, setError(error.message)),
                    finalize: () => patchState(store, setCompleted())
                })
            ))
        )),

        setBeefEntities(newBeefEntities: ProductWithMeatDetails[]) {
            patchState(store, { beefEntities: newBeefEntities });
        },
        setChickenEntities(newChickenEntities: ProductWithMeatDetails[]) {
            patchState(store, { chickenEntities: newChickenEntities });
        },

        setHalfCarcassWeight(weight: number) {
            patchState(store, { halfCarcassWeight: weight })
        },
        setChickenWeight(weight: number) {
            patchState(store, { chickenWeight: weight })
        }
    })),
    withHooks((store) => ({
        onInit() {
           store.getBeefEntities();
           store.getChickenEntities();
        }
    }))
);

interface MeatDetailsState {
    beefEntities: ProductWithMeatDetails[],
    chickenEntities: ProductWithMeatDetails[],
    halfCarcassWeight: number,
    chickenWeight: number
}