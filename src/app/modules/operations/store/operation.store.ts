import { BaseState } from "src/app/shared/store/crud.feature";
import { OperationResponse } from "../models/operation.model";
import { Photo } from "@capacitor/camera";
import { patchState, signalStore, withComputed, withMethods, withState } from "@ngrx/signals";
import { OperationService } from "../services/operation.service";
import { computed, inject } from "@angular/core";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { pipe, switchMap } from "rxjs";
import { tapResponse } from "@ngrx/operators";
import { FileUtility } from "src/app/shared/utils/file.utility";
import { HttpErrorResponse } from "@angular/common/http";
import { setCompleted, setError, setSuccess, withRequestStatus } from "src/app/shared/store/request.feature";

const initialState: OperationState = {
    entities: [],
    lastUpdatedEntity: undefined,
    receipt: undefined
}

export const OperationStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withRequestStatus(),
    withMethods((store, service = inject(OperationService)) => ({
        getEntities: rxMethod<number>(pipe(
            switchMap((accountId) => service.getEntities(accountId).pipe(
                tapResponse({
                    next: (entities) => patchState(store, { entities }),
                    error: (error: HttpErrorResponse) => patchState(store, setError(error.message)),
                    finalize: () => patchState(store, setCompleted())
                })
            ))
        )),
        addEntity: rxMethod<FormData>(pipe(
            switchMap((entity) => service.createEntity(entity).pipe(
                tapResponse({
                    next: (createdEntity) => patchState(store, (state) => (
                        { entities: [...state.entities, createdEntity] }),
                        { lastUpdatedEntity: createdEntity },
                        setSuccess('Creado correctamente!')),
                    error: (error: HttpErrorResponse) => patchState(store, setError(error.message)),
                    finalize: () => patchState(store, setCompleted())
                })
            ))
        )),
        editEntity: rxMethod<{ id: number, entity: FormData }>(pipe(
            switchMap((request) => service.editEntity(request.id, request.entity).pipe(
                tapResponse({
                    next: (editedEntity) => patchState(store, (state) => (
                        { entities: state.entities.map(entity => (entity.id === editedEntity.id) ? editedEntity : entity) }),
                        { lastUpdatedEntity: editedEntity },
                        setSuccess('Modificado correctamente!')),
                    error: (error: HttpErrorResponse) => patchState(store, setError(error.message)),
                    finalize: () => patchState(store, setCompleted())
                })
            ))
        )),
        deleteEntity: rxMethod<number>(pipe(
            switchMap((entityId) => service.deleteEntity(entityId).pipe(
                tapResponse({
                    next: (deledtedEntity) => patchState(store, (state) => (
                        { entities: state.entities.map(entity => (entity.id === deledtedEntity.id) ? deledtedEntity : entity) }),
                        { lastUpdatedEntity: deledtedEntity },
                        setSuccess('Eliminado correctamente!')),
                    error: (error: HttpErrorResponse) => patchState(store, setError(error.message)),
                    finalize: () => patchState(store, setCompleted())
                })
            ))
        )),
        getReceiptFile: rxMethod<number>(pipe(
            switchMap((id) => service.getReceiptFile(id).pipe(
                tapResponse({
                    next: async (receipt) => patchState(store, { receipt: await FileUtility.getPhotoFromBlob(receipt) }),
                    error: (error: HttpErrorResponse) => patchState(store, setError(error.message)),
                    finalize: () => patchState(store, setCompleted())
                })
            ))
        )),
        getEntityById(id: number) {
            return store.entities().find(entity => entity.id === id)!;
        }
    })),
    withComputed((state) => ({
        enabledEntities: computed(() => state.entities().filter(entity => entity.isEnabled)),
        deletedEntities: computed(() => state.entities().filter(entity => !entity.isEnabled))
    })),
);

interface OperationState extends BaseState<OperationResponse> {
    receipt: Photo | undefined
}