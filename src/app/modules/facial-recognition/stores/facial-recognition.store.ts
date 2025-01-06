import { inject } from "@angular/core";
import { Photo } from "@capacitor/camera";
import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { EmployeeService } from "../../employees/services/employee.service";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { pipe, switchMap } from "rxjs";
import { tapResponse } from "@ngrx/operators";
import { FileUtility } from "src/app/shared/utils/file.utility";
import { setCompleted, setError, setSuccess, withRequestStatus } from "src/app/shared/store/request.feature";
import { HttpErrorResponse } from "@angular/common/http";

const initialState: FacialRecognitionState = {
    faceImage: undefined
}

export const FacialRecognitionStore = signalStore(
    // { providedIn: 'root' } No usa providedIn: 'root' dado que debe usarse en cada componente individualmente. No es un manejo de state global.
    withState(initialState),
    withRequestStatus(),
    withMethods((store, service = inject(EmployeeService)) => ({
        createFaceImage: rxMethod<{ id: number, faceImageData: FormData }>(pipe(
            switchMap((req) => service.createFaceImage(req.id, req.faceImageData).pipe(
                tapResponse({
                    next: async (faceImage) => {
                        if (faceImage instanceof Blob) {
                            patchState(store, { faceImage: await FileUtility.getPhotoFromBlob(faceImage) });
                            patchState(store, setSuccess("Imagen facial cargada y reconocida correctamente"));
                        }
                    },
                    error: (error: HttpErrorResponse) => patchState(store, setError(error.message)),
                    finalize: () => patchState(store, setCompleted())
                })
            ))
        )),
        getFaceImageFile: rxMethod<number>(pipe(
            switchMap((id) => service.getFaceImageFile(id).pipe(
                tapResponse({
                    next: async (faceImage) => {
                        if (faceImage instanceof Blob) {
                            patchState(store, { faceImage: await FileUtility.getPhotoFromBlob(faceImage) })
                        }
                    },
                    error: (error: HttpErrorResponse) => patchState(store, setError(error.message)),
                    finalize: () => patchState(store, setCompleted())
                })
            ))
        ))
    }))
);

interface FacialRecognitionState {
    faceImage: Photo | undefined
}