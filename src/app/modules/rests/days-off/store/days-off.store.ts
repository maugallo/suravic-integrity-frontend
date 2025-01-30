import { BaseState, withCrudOperations } from "src/app/shared/store/crud.feature";
import { DayOffRequest, DayOffResponse } from "../models/day-off.model";
import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { DayOffService } from "../services/day-off.service";
import { EmployeeResponse } from "src/app/modules/employees/models/employee.model";

const initialState: DayOffState = {
    entities: [],
    lastUpdatedEntity: undefined
}

export const DayOffStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withCrudOperations<DayOffRequest, DayOffResponse>(DayOffService),
    withMethods(store => ({
        updateEntitiesByEmployee(employee: EmployeeResponse) {
            patchState(store, (state) => ({
                entities: state.entities.map(entity =>
                    entity.employee.id === employee.id ?
                        { ...entity, isEnabled: employee.isEnabled } :
                        entity
                )
            }))
        }
    }))
);

interface DayOffState extends BaseState<DayOffResponse> { }