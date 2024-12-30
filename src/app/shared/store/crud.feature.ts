import { patchState, signalStoreFeature, type, withComputed, withHooks, withMethods } from "@ngrx/signals";
import { BaseEntity } from "../models/base-entity.model";
import { BaseService } from "../models/base-service.model";
import { computed, inject, Type } from "@angular/core";
import { setCompleted, setError, setSuccess, withRequestStatus } from "../store/request.feature";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { pipe, switchMap } from "rxjs";
import { tapResponse } from "@ngrx/operators";
import { HttpErrorResponse } from "@angular/common/http";

/* Feature que ofrece un CRUD para todos los stores donde:
- Services extend BaseService.
- Models extend BaseEntity. */

export function withCrudOperations<EntityRequest extends BaseEntity | FormData, EntityResponse extends BaseEntity>(entityService: Type<BaseService<EntityRequest, EntityResponse>>) {
    return signalStoreFeature(
        { state: type<BaseState<EntityResponse>>() },
        withRequestStatus(),
        withMethods((store, service = inject(entityService)) => ({
            getEntities: rxMethod<void>(pipe(
                switchMap(() => service.getEntities().pipe(
                    tapResponse({
                        next: (entities) => patchState(store, { entities }),
                        error: (error: HttpErrorResponse) => patchState(store, setError(error.message)),
                        finalize: () => patchState(store, setCompleted())
                    })
                ))
            )),
            addEntity: rxMethod<EntityRequest>(pipe(
                switchMap((entity) => service.createEntity(entity).pipe(
                    tapResponse({
                        next: (createdEntity) => patchState(store, (state) => (
                            { entities: [...state.entities, createdEntity] }),
                            setSuccess('Creado correctamente!')),
                        error: (error: HttpErrorResponse) => patchState(store, setError(error.message)),
                        finalize: () => patchState(store, setCompleted())
                    })
                ))
            )),
            editEntity: rxMethod<{ id: number, entity: EntityRequest }>(pipe(
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
                        next: (editedEntity) => patchState(store, (state) => (
                            { entities: state.entities.map(entity => (entity.id === editedEntity.id) ? editedEntity : entity) }),
                            { lastUpdatedEntity: editedEntity },
                            setSuccess(editedEntity.isEnabled ? 'Recuperado correctamente!' : 'Eliminado correctamente!')),
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
        withHooks((store) => ({
            onInit: () => {
                store.getEntities();
            }
        }))
    );
}

export interface BaseState<EntityResponse> {
    entities: EntityResponse[],
    lastUpdatedEntity: EntityResponse | undefined
};