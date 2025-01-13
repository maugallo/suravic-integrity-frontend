import { BaseState, withCrudOperations } from "src/app/shared/store/crud.feature";
import { PublicHolidayRequest, PublicHolidayResponse } from "../models/public-holiday.model";
import { signalStore, withState } from "@ngrx/signals";
import { PublicHolidayService } from "../services/public-holiday.service";

const initialState: PublicHolidayState = {
    entities: [],
    lastUpdatedEntity: undefined
}

export const PublicHolidayStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withCrudOperations<PublicHolidayRequest, PublicHolidayResponse>(PublicHolidayService)
);

interface PublicHolidayState extends BaseState<PublicHolidayResponse> { }