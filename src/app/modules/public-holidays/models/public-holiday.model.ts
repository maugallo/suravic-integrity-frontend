import { ShiftResponse } from "src/app/modules/shifts/models/shift.model"
import { BaseEntity } from "src/app/shared/models/base-entity.model"

export interface PublicHolidayRequest extends BaseEntity {
    reason: string,
    date: string, 
    shiftIds: number[]
}

export interface PublicHolidayResponse extends BaseEntity {
    id: number,
    reason: string,
    date: string, 
    shifts: ShiftResponse[],
    isEnabled: boolean
}