import { ContactRequest, ContactResponse } from "./contact.model";
import { ShiftResponse } from "./shift.model";

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