import { CreditAccountResponse } from "src/app/operations/models/operation.model";
import { ContactRequest, ContactResponse } from "src/shared/models/contact.model";
import { ShiftResponse } from "src/app/shifts/models/shift.model";

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