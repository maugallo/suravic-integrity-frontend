import { BaseEntity } from "src/app/shared/models/base-entity.model"

export interface ShiftRequest extends BaseEntity {
    name: string,
    startTime: string,
    endTime: string
    activeDays: string[]
}

export interface ShiftResponse extends BaseEntity {
    id: number,
    name: string,
    startTime: string,
    endTime: string,
    activeDays: string[],
    isEnabled: boolean
}