import { BaseState, withCrudOperations } from "src/app/shared/store/crud.feature";
import { LicenseRequest, LicenseResponse } from "../models/license.model";
import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { LicenseService } from "../services/license.service";
import { EmployeeResponse } from "src/app/modules/employees/models/employee.model";

const initialState: LicenseState = {
    entities: [],
    lastUpdatedEntity: undefined
}

export const LicenseStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withCrudOperations<LicenseRequest, LicenseResponse>(LicenseService),
    withMethods(store => ({
        updateEntitiesByEmployee(employee: EmployeeResponse) {
            patchState(store, (state) => ({
                entities: state.entities.map(entity => 
                    entity.employee.id === employee.id ?
                    {...entity, isEnabled: employee.isEnabled, employee} :
                    entity
                )
            }))
        }
    }))
);

interface LicenseState extends BaseState<LicenseResponse> { }