import { EmployeeResponse } from "./employee.model"

export interface LicenseRequest {
    employeeId: number,
    type: string,
    startDate: string,
    endDate: string
}

export interface LicenseResponse {
    id: number,
    employee: EmployeeResponse,
    type: string,
    startDate: string,
    endDate: string
}