import { ShiftResponse } from "src/app/modules/shifts/models/shift.model"

export interface PublicHolidayRequest {
    reason: string,
    date: string, 
    shiftIds: number[]
}

export interface PublicHolidayResponse {
    id: number,
    reason: string,
    date: string, 
    shifts: ShiftResponse[]
}