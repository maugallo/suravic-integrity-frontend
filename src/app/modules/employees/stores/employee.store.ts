import { BaseState, withCrudOperations } from "src/app/shared/store/crud.feature";
import { EmployeeRequest, EmployeeResponse } from "../models/employee.model";
import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { EmployeeService } from "../services/employee.service";
import { ShiftResponse } from "../../shifts/models/shift.model";

const initialState: EmployeeState = {
    entities: [],
    lastUpdatedEntity: undefined,
}

export const EmployeeStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withCrudOperations<EmployeeRequest, EmployeeResponse>(EmployeeService),
    withMethods((store) => ({
        updateEntitiesByShift(updatedShift: ShiftResponse) {
            patchState(store, (state) => ({
                entities: state.entities.map(employee => 
                    (employee.shifts.some(shift => shift.id === updatedShift.id))
                    ? { ...employee, shifts: employee.shifts.map(shift => shift.id === updatedShift.id ? updatedShift : shift) }
                    : employee)
            }))
        }
    }))
);

interface EmployeeState extends BaseState<EmployeeResponse> { }