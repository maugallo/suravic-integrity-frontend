import { BaseState, withCrudOperations } from "src/app/shared/store/crud.feature";
import { ProductRequest, ProductResponse, ProductWithMeatDetails } from "../models/product.model";
import { patchState, signalStore, withMethods, withState } from "@ngrx/signals";
import { ProductService } from "../services/product.service";
import { ProviderResponse } from "../../providers/models/provider.model";
import { CategoryResponse } from "../../categories/models/category.model";
import { rxMethod } from "@ngrx/signals/rxjs-interop";
import { pipe, switchMap } from "rxjs";
import { inject } from "@angular/core";
import { tapResponse } from "@ngrx/operators";
import { setCompleted, setError, setSuccess, withRequestStatus } from "src/app/shared/store/request.feature";
import { HttpErrorResponse } from "@angular/common/http";

const initialState: ProductState = {
    entities: [],
    lastUpdatedEntity: undefined
}

export const ProductStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withCrudOperations<ProductRequest, ProductResponse>(ProductService),
    withMethods((store, service = inject(ProductService)) => ({
        updateEntitiesPrice: rxMethod<ProductResponse[]>(pipe(
            switchMap((products) => service.editPrices(products).pipe(
                tapResponse({
                    next: (modifiedProducts) => patchState(store, (state) => ({
                        entities: state.entities.map(entity => {
                            const matchingProduct = modifiedProducts.find(product => product.id === entity.id);
                            return matchingProduct ? { ...entity, price: matchingProduct.price } : entity;
                        })
                    }), setSuccess("Precios de productos actualizados correctamente!")),
                    error: (error: HttpErrorResponse) => patchState(store, setError(error.message)),
                    finalize: () => patchState(store, setCompleted())
                })
            ))
        )),
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
        },
        updateEntitiesByPricing(pricingProducts: ProductWithMeatDetails[]) {
            patchState(store, (state) => ({
                entities: state.entities.map(product => {
                    const updatedProduct = pricingProducts.find(
                        (pricingProduct) => pricingProduct.id === product.id)!;
                    return { ...product, price: updatedProduct.price };
                })
            }))
        },
        getEntitiesByProvider(providerId: number) {
            return store.entities().filter(entity => entity.provider.id === providerId)!;
        }
    }))
);

interface ProductState extends BaseState<ProductResponse> { }