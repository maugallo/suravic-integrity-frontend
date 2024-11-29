import { EmployeeRequest, EmployeeResponse } from "src/app/employees/models/employee.model"

export class EmployeeMapper {

    public static toEmployeeRequest(employee: EmployeeResponse): EmployeeRequest {
        return {
            contact: employee.contact,
            shiftIds: employee.shifts.map(shift => shift.id),
            role: employee.role,
            firstName: employee.firstName,
            lastName: employee.lastName,
            dni: employee.dni,
            street: employee.street,
            num: employee.num,
            zipCode: employee.zipCode,
            birthDate: employee.birthDate,
            hireDate: employee.hireDate,
            vacationDays: employee.vacationDays
        }
    }

}