import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { ProviderRequest, ProviderResponse } from "../models/provider.model";
import { BaseState, withCrudOperations } from "src/app/shared/store/crud.feature";
import { ProviderService } from "../services/provider.service";
import { SectorResponse } from "../../sectors/models/sector.model";

const initialState: ProviderState = {
    entities: [],
    lastUpdatedEntity: undefined
}

export const ProviderStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withCrudOperations<ProviderRequest, ProviderResponse>(ProviderService),
    withMethods((store) => ({
        updateEntitiesBySector(sector: SectorResponse) {
            patchState(store, (state) => ({
                entities: state.entities.map(provider => 
                    (provider.sector.id === sector.id)
                    ? { ...provider, sector: { ...sector } }
                    : provider)
            }))
        }
    }))
);

interface ProviderState extends BaseState<ProviderResponse> { }