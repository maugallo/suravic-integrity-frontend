import { BaseEntity } from "src/app/shared/models/base-entity.model"

export interface CategoryRequest extends BaseEntity {
    name: string
}

export interface CategoryResponse extends BaseEntity {
    id: number,
    name: string,
    isEnabled: boolean
}