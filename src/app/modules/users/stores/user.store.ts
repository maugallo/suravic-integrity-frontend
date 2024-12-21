import { signalStore, withState } from "@ngrx/signals";
import { UserRequest, UserResponse } from "../models/user.model";
import { UserService } from "../services/user.service";
import { BaseState, withCrudOperations } from "src/app/shared/store/crud.feature";

const initialState: UserState = {
  entities: [],
  lastUpdatedEntity: undefined
};

export const UserStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withCrudOperations<UserRequest, UserResponse>(UserService)
);

interface UserState extends BaseState<UserResponse> { }