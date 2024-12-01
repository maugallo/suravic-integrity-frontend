import { computed } from "@angular/core";
import { signalStoreFeature, withComputed, withState } from "@ngrx/signals";

/* Feature que ayuda a todos los stores a gestionar la devolución de una llamada
a una API, ya sea success, error o pending. */

/* Custom feature para NgRx Signal Store. */

// REVISAR BIEN EL FEATURE Y SI SE PUEDE MEJORAR LEER DOCS DE signalStoreFeature

export enum ApiStatus {
    NONE = 'none',
    PENDING = 'pending',
    SUCCESS = 'success',
    ERROR = 'error'
}

interface ApiRequest {
    status: ApiStatus,
    message?: string
}

const requestStatus = {
    status: ApiStatus.NONE,
    message: ''
}

export function withRequestStatus() {
    return signalStoreFeature(
        withState(requestStatus),
        withComputed((requestStatus) => ({
            isCompleted: computed(() => requestStatus.status() === ApiStatus.SUCCESS),
            isPending: computed(() => requestStatus.status() === ApiStatus.PENDING),
            isError: computed(() => requestStatus.status() === ApiStatus.ERROR)
        }))
    );
}

export function setNone(): ApiRequest {
    return { status: ApiStatus.NONE };
}

export function setPending(): ApiRequest {
    return { status: ApiStatus.PENDING };
}

export function setCompleted(successMessage: string): ApiRequest {
    return { status: ApiStatus.SUCCESS, message: successMessage };
}

export function setError(errorMessage: string): ApiRequest {
    return { status: ApiStatus.ERROR, message: errorMessage };
}