import { computed } from "@angular/core";
import { signalStoreFeature, withComputed, withState } from "@ngrx/signals";

/* Feature que ayuda a todos los stores a gestionar la devolución de una llamada
a una API, ya sea success, error o pending. */

/* Custom feature para NgRx Signal Store. */

enum ApiStatus {
    PENDING = 'pending',
    COMPLETED = 'completed',
    SUCCESS = 'success',
    ERROR = 'error'
}

interface ApiRequestState {
    status: ApiStatus,
    message: string
}

const apiRequest: ApiRequestState = {
    status: ApiStatus.COMPLETED,
    message: ''
}

export type RequestStatus = 'idle' | 'pending' | 'fulfilled' | { error: string };
export type RequestStatusState = { requestStatus: RequestStatus };

export function withRequestStatus() {
    return signalStoreFeature(
        withState(apiRequest),
        withComputed((apiRequest) => ({
            pending: computed(() => apiRequest.status() === ApiStatus.PENDING),
            success: computed(() => apiRequest.status() === ApiStatus.SUCCESS),
            error: computed(() => apiRequest.status() === ApiStatus.ERROR)
        }))
    );
}

export function setPending(): ApiRequestState {
    console.log("set pending")
    return { status: ApiStatus.PENDING, message: '' }
}

export function setSuccess(successMessage: string): ApiRequestState {
    console.log("set success")
    return { status: ApiStatus.SUCCESS, message: successMessage }
}

export function setError(errorMessage: string): ApiRequestState {
    console.log("set error")
    return { status: ApiStatus.ERROR, message: errorMessage }
}

export function setCompleted(): ApiRequestState {
    console.log("set completed")
    return { status: ApiStatus.COMPLETED, message: '' }
}