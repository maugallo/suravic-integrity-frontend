import { patchState, signalStore, withHooks, withMethods, withState } from "@ngrx/signals";
import { UserRequest, UserResponse } from "../models/user.model";
import { inject } from "@angular/core";
import { UserService } from "../services/user.service";
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { finalize, pipe, switchMap, tap } from "rxjs";
import { tapResponse } from "@ngrx/operators";
import { HttpErrorResponse } from "@angular/common/http";
import { setCompleted, setError, setNone, setPending, withRequestStatus } from "src/shared/stores/api-request-status.feature";

interface UsersState {
    users: UserResponse[]
};

const initialState: UsersState = {
    users: []
};

export const UsersStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withRequestStatus(),
    withMethods((store, usersService = inject(UserService)) => ({
        getUsers: rxMethod<void>(pipe(
            tap(() => patchState(store, setPending())),
            switchMap(() => usersService.getUsers()),
            tapResponse({
                next: (users) => patchState(store, { users }),
                error: (error: HttpErrorResponse) => patchState(store, setError(error.message)),
                finalize: () => patchState(store, setNone())
            })
        )),
        getUserById(id: number) {
            return store.users().find(user => user.id === id);
        },
        addUser: rxMethod<UserRequest>(pipe(
            tap(() => console.log("Calling addUser!")),
            tap(() => patchState(store, setPending())),
            switchMap((user) => usersService.createUser(user)),
            tapResponse({
                next: (createdUser: UserResponse) => patchState(store, (state) => (
                    { users: [...state.users, createdUser] }),
                    setCompleted('Usuario creado correctamente')
                ),
                error: (error: HttpErrorResponse) => patchState(store, setError(error.message))
            }),
            finalize(() => patchState(store, setNone()))
        )),
        editUser: rxMethod<EditUserObject>(pipe(
            tap(() => patchState(store, setPending())),
            switchMap((request) => usersService.editUser(request.id, request.user)),
            tapResponse({
                next: (editedUser: UserResponse) => patchState(store, (state) => (
                    { users: state.users.map(user => (user.id === editedUser.id) ? editedUser : user) }),
                    setCompleted('Usuario modificado correctamente')
                ),
                error: (error: HttpErrorResponse) => patchState(store, setError(error.message))
            })
        ))
    })),
    withHooks((store) => ({
        onInit() {
            store.getUsers();
        }
    }))
);

interface EditUserObject {
    id: number,
    user: UserRequest
}