import { BaseState, withCrudOperations } from "src/app/shared/store/crud.feature";
import { EmployeeRequest, EmployeeResponse } from "../models/employee.model";
import { signalStore, withState } from "@ngrx/signals";
import { EmployeeService } from "../services/employee.service";

const initialState: EmployeeState = {
    entities: [],
    lastUpdatedEntity: undefined,
}

export const EmployeeStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withCrudOperations<EmployeeRequest, EmployeeResponse>(EmployeeService),
);

interface EmployeeState extends BaseState<EmployeeResponse> { }