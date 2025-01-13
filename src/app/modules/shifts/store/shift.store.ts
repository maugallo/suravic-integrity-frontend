import { signalStore, withState } from "@ngrx/signals";
import { BaseState, withCrudOperations } from "src/app/shared/store/crud.feature";
import { ShiftRequest, ShiftResponse } from "../models/shift.model";
import { ShiftService } from "../services/shift.service";

const initialState: ShiftState = {
    entities: [],
    lastUpdatedEntity: undefined
};

export const ShiftStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withCrudOperations<ShiftRequest, ShiftResponse>(ShiftService)
);

interface ShiftState extends BaseState<ShiftResponse> { };