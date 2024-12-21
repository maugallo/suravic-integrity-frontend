import { BaseState, withCrudOperations } from "src/app/shared/store/crud.feature";
import { SectorRequest, SectorResponse } from "../models/sector.model";
import { signalStore, withState } from "@ngrx/signals";
import { SectorService } from "../services/sector.service";

const initialState: SectorState = {
    entities: [],
    lastUpdatedEntity: undefined
};

export const SectorStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withCrudOperations<SectorRequest, SectorResponse>(SectorService)
);

interface SectorState extends BaseState<SectorResponse> { };