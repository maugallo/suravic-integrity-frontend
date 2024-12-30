import { BaseState, withCrudOperations } from "src/app/shared/store/crud.feature";
import { signalStore, withState } from "@ngrx/signals";
import { CategoryRequest, CategoryResponse } from "../models/category.model";
import { CategoryService } from "../services/category.service";

const initialState: CategoryState = {
    entities: [],
    lastUpdatedEntity: undefined
};

export const CategoryStore = signalStore(
    { providedIn: 'root' },
    withState(initialState),
    withCrudOperations<CategoryRequest, CategoryResponse>(CategoryService)
);

interface CategoryState extends BaseState<CategoryResponse> { };