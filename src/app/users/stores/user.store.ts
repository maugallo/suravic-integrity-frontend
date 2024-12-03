import { patchState, signalStore, withHooks, withMethods, withState } from "@ngrx/signals";
import { UserRequest, UserResponse } from "../models/user.model";
import { inject } from "@angular/core";
import { UserService } from "../services/user.service";
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from "rxjs";
import { tapResponse } from "@ngrx/operators";
import { HttpErrorResponse } from "@angular/common/http";
import { setCompleted, setError, setPending, setSuccess, withRequestStatus } from "src/shared/stores/api-request.feature";

const initialState: UsersState = {
    users: []
};

export const UserStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withRequestStatus(),
    withMethods((store, userService = inject(UserService)) => ({
        getUsers: rxMethod<void>(pipe(
            tap(() => patchState(store, setPending())),
            switchMap(() => userService.getUsers().pipe(
                tapResponse({
                    next: (users) => patchState(store, { users }),
                    error: (error: HttpErrorResponse) => patchState(store, setError(error.message)),
                    finalize: () => patchState(store, setCompleted())
                })
            )),
        )),
        addUser: rxMethod<UserRequest>(pipe(
            tap(() => setPending()),
            switchMap((user) => userService.createUser(user).pipe(
                tapResponse({
                    next: (createdUser) => patchState(store, (state) => (
                        { users: [...state.users, createdUser] }),
                        setSuccess('Usuario agregado correctamente!')),
                    error: (error: HttpErrorResponse) => patchState(store, setError(error.message)),
                    finalize: () => patchState(store, setCompleted())
                })
            ))
        )),
        editUser: rxMethod<EditUserObject>(pipe(
            tap(() => patchState(store, setPending())),
            switchMap((request) => userService.editUser(request.id, request.user).pipe(
                tapResponse({
                    next: (editedUser: UserResponse) => patchState(store, (state) => (
                        { users: state.users.map(user => (user.id === editedUser.id) ? editedUser : user) }),
                        setSuccess('Usuario modificado correctamente!')),
                    error: (error: HttpErrorResponse) => patchState(store, setError(error.message)),
                    finalize: () => patchState(store, setCompleted())
                })
            ))
        )),
        deleteUser: rxMethod<number>(pipe(
            tap(() => patchState(store, setPending())),
            switchMap((userId) => userService.deleteUser(userId).pipe(
                tapResponse({
                    next: () => patchState(store, (state) => (
                        { users: state.users.filter(user => user.id !== userId) }),
                        setSuccess('Usuario eliminado correctamente!')),
                    error: (error: HttpErrorResponse) => patchState(store, setError(error.message)),
                    finalize: () => patchState(store, setCompleted())
                })
            ))
        )),
        getUserById(id: number) {
            return store.users().find(user => user.id === id);
        }
    })),
    withHooks((store) => ({
        onInit() {
            store.getUsers();
        }
    }))
);

interface UsersState {
    users: UserResponse[]
};

interface EditUserObject {
    id: number,
    user: UserRequest
}