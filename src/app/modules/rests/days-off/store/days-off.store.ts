import { BaseState, withCrudOperations } from "src/app/shared/store/crud.feature";
import { DayOffRequest, DayOffResponse } from "../models/day-off.model";
import { signalStore, withState } from "@ngrx/signals";
import { DayOffService } from "../services/day-off.service";

const initialState: DayOffState = {
    entities: [],
    lastUpdatedEntity: undefined
}

export const DayOffStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withCrudOperations<DayOffRequest, DayOffResponse>(DayOffService)
);

interface DayOffState extends BaseState<DayOffResponse> { }