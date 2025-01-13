import { BaseState, withCrudOperations } from "src/app/shared/store/crud.feature";
import { LicenseRequest, LicenseResponse } from "../models/license.model";
import { signalStore, withState } from "@ngrx/signals";
import { LicenseService } from "../services/license.service";

const initialState: LicenseState = {
    entities: [],
    lastUpdatedEntity: undefined
}

export const LicenseStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withCrudOperations<LicenseRequest, LicenseResponse>(LicenseService)
);

interface LicenseState extends BaseState<LicenseResponse> { }