import { EmployeeResponse } from "src/app/modules/employees/models/employee.model"
import { BaseEntity } from "src/app/shared/models/base-entity.model"

export interface LicenseRequest extends BaseEntity {
    employeeId: number,
    type: string,
    startDate: string,
    endDate: string
}

export interface LicenseResponse extends BaseEntity {
    id: number,
    employee: EmployeeResponse,
    type: string,
    startDate: string,
    endDate: string,
    isEnabled: boolean
}