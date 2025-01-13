import { EmployeeResponse } from "src/app/modules/employees/models/employee.model"
import { ShiftResponse } from "src/app/modules/shifts/models/shift.model"
import { BaseEntity } from "src/app/shared/models/base-entity.model"

export interface DayOffRequest extends BaseEntity {
    employeeId: number,
    shiftIds: number[],
    day: string
}

export interface DayOffResponse extends BaseEntity {
    id: number,
    employee: EmployeeResponse,
    shifts: ShiftResponse,
    day: string,
    isEnabled: boolean
}