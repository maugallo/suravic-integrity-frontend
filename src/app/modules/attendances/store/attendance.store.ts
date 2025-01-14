import { inject } from "@angular/core";
import { patchState, signalStore, withMethods } from "@ngrx/signals";
import { setCompleted, setError, setSuccess, withRequestStatus } from "src/app/shared/store/request.feature";
import { AttendanceService } from "../services/attendance.service";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { pipe, switchMap } from "rxjs";
import { tapResponse } from "@ngrx/operators";
import { HttpErrorResponse } from "@angular/common/http";

export const AttendanceStore = signalStore(
    { providedIn: 'root' },
    withRequestStatus(),
    withMethods((store, service = inject(AttendanceService)) => ({
        markAttendance: rxMethod<FormData>(pipe(
            switchMap((formData) => service.markAttendance(formData).pipe(
                tapResponse({
                    next: (message) => patchState(store, setSuccess(message)),
                    error: (error: HttpErrorResponse) => patchState(store, setError(error.message)),
                    finalize: () => patchState(store, setCompleted())
                })
            ))
        ))
    }))
);