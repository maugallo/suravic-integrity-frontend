import { EmployeeResponse } from "src/app/employees/models/employee.model"
import { ShiftResponse } from "src/app/shifts/models/shift.model"

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