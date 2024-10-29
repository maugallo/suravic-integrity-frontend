import { ShiftResponse } from "./shift.model"

export interface PublicHolidayRequest {
    reason: string,
    date: string, 
    shiftIds: number[]
}

export interface PublicHolidayResponse {
    id: number,
    reason: string,
    date: string, 
    shiftIds: ShiftResponse[]
}