import { CreditAccountResponse } from "src/app/modules/operations/models/operation.model";
import { ContactRequest, ContactResponse } from "src/app/shared/models/contact.model";
import { ShiftResponse } from "src/app/modules/shifts/models/shift.model";

export interface EmployeeRequest {
    contact: ContactRequest,
    shiftIds: number[],
    role: string,
    firstName: string,
    lastName: string,
    dni: string,
    street: string,
    num: string,
    zipCode: string,
    birthDate: string,
    hireDate: string,
    vacationDays: number
}

export interface EmployeeResponse {
    id: number,
    creditAccount: CreditAccountResponse,
    contact: ContactResponse,
    shifts: ShiftResponse[],
    role: string,
    firstName: string,
    lastName: string,
    dni: string,
    street: string,
    num: string,
    zipCode: string,
    birthDate: string,
    hireDate: string,
    vacationDays: number,
    isEnabled: boolean
}