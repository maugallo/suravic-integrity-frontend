import { EmployeeResponse } from "./employee.model"
import { ShiftResponse } from "./shift.model"

export interface DayOffRequest {
    employeeId: number,
    shiftIds: number[],
    day: string
}

export interface DayOffResponse {
    id: number,
    employee: EmployeeResponse,
    shifts: ShiftResponse,
    day: string
}