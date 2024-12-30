import { BaseState, withCrudOperations } from "src/app/shared/store/crud.feature";
import { ProductRequest, ProductResponse } from "../models/product.model";
import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { ProductService } from "../services/product.service";
import { ProviderResponse } from "../../providers/models/provider.model";
import { CategoryResponse } from "../../categories/models/category.model";

const initialState: ProductState = {
    entities: [],
    lastUpdatedEntity: undefined
}

export const ProductStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withCrudOperations<ProductRequest, ProductResponse>(ProductService),
    withMethods((store) => ({
        updateEntitiesByProvider(provider: ProviderResponse) {
            patchState(store, (state) => ({
                entities: state.entities.map(product => 
                    (product.provider.id === provider.id)
                    ? { ...product, provider: { ...provider } }
                    : product)
            }))
        },
        updateEntitiesByCategory(category: CategoryResponse) {
            patchState(store, (state) => ({
                entities: state.entities.map(product => 
                    (product.category.id === category.id)
                    ? { ...product, category: { ...category } }
                    : product)
            }))
        }
    }))
);

interface ProductState extends BaseState<ProductResponse> { }