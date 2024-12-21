import { BaseEntity } from "src/app/shared/models/base-entity.model"

export interface SectorRequest extends BaseEntity {
    name: string
}

export interface SectorResponse extends BaseEntity {
    id: number,
    name: string,
    isEnabled: boolean
}