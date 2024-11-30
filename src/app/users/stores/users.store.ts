import { patchState, signalStore, withHooks, withMethods, withState } from "@ngrx/signals";
import { UserRequest, UserResponse } from "../models/user.model";
import { inject } from "@angular/core";
import { UserService } from "../services/user.service";
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from "rxjs";
import { tapResponse } from "@ngrx/operators";
import { HttpErrorResponse } from "@angular/common/http";

interface ApiResponse {
    success: boolean,
    message: string
}

interface UsersState {
    users: UserResponse[],
    loading: boolean,
    apiResponse: ApiResponse | undefined
};

const initialState: UsersState = {
    users: [],
    loading: false,
    apiResponse: undefined
};

export const UsersStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withMethods((store, usersService = inject(UserService)) => ({
        getUsers: rxMethod<void>(pipe(
            tap(() => patchState(store, { loading: true })),
            switchMap(() => usersService.getUsers()),
            tapResponse({
                next: (users) => patchState(store, { users, loading: false }),
                error: () => null
            })
        )),
        getUserById(id: number) {
            return store.users().find(user => user.id === id);
        },
        addUser: rxMethod<UserRequest>(pipe(
            tap(() => patchState(store, { loading: true })),
            switchMap((user) => usersService.createUser(user)),
            tapResponse({
                next: (createdUser: UserResponse) => patchState(store, (state) => ({ users: [...state.users, createdUser], apiResponse: { success: true, message: 'Usuario creado correctamente' } })),
                error: (error: HttpErrorResponse) => patchState(store, { apiResponse: { success: false, message: error.message } }),
            }),
            tap(() => patchState(store, { loading: false, apiResponse: undefined }))
        ))
    })),
    withHooks((store) => ({
        onInit() {
            store.getUsers();
        }
    }))
);