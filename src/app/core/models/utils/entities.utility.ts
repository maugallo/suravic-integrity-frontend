import { DayOffRequest } from "../interfaces/day-off.model";
import { EmployeeRequest } from "../interfaces/employee.model";
import { LicenseRequest } from "../interfaces/license.model";
import { OperationRequest } from "../interfaces/operation.model";
import { OrderRequest } from "../interfaces/order.model";
import { ProductRequest } from "../interfaces/product.model";
import { ProviderRequest } from "../interfaces/provider.model";
import { PublicHolidayRequest } from "../interfaces/public-holiday.model";
import { ShiftRequest } from "../interfaces/shift.model";
import { UserRequest } from "../interfaces/user.model";

export class EntitiesUtility {

    public static getEmptyUserRequest(): UserRequest {
        return {
            username: '',
            password: '',
            role: ''
        }
    }

    public static getEmptyProductRequest(): ProductRequest {
        return {
            categoryId: -1,
            providerId: -1,
            plu: '',
            title: '',
            price: ''
        }
    }

    public static getEmptyProviderRequest(): ProviderRequest {
        return {
            sectorId: -1,
            contact: { email: '', telephone: '' },
            percentages: { profitPercentage: '', vatPercentage: '', perceptionPercentage: '', grossIncomePercentage: '' },
            vatCondition: '',
            companyName: '',
            firstName: '',
            lastName: '',
            cuit: ''
        }
    }

    public static getEmptyOrderRequest(): OrderRequest {
        return {
            providerId: -1,
            userId: -1,
            status: '',
            paymentMethodIds: [],
            deliveryDate: new Date().toISOString(),
            total: '',
            invoice: undefined,
            paymentReceipt: undefined
        }
    }

    public static getEmptyShiftRequest(): ShiftRequest {
        return {
            name: '',
            startTime: '00:00',
            endTime: '00:00'
        }
    }

    public static getEmptyPublicHolidayRequest(): PublicHolidayRequest {
        return {
            reason: '',
            date: new Date().toISOString(),
            shiftIds: []
        }
    }

    public static getEmptyEmployeeRequest(): EmployeeRequest {
        return {
            contact: { email: '', telephone: '' },
            shiftIds: [],
            role: '',
            firstName: '',
            lastName: '',
            dni: '',
            street: '',
            num: '',
            zipCode: '',
            birthDate: new Date().toISOString(),
            hireDate: new Date().toISOString(),
            vacationDays: 0
        }
    }

    public static getEmptyDayOffRequest(): DayOffRequest {
        return {
            employeeId: 0,
            shiftIds: [],
            day: new Date().toISOString()
        }
    }

    public static getEmptyOperationRequest(): OperationRequest {
        return {
            creditAccountId: -1,
            userId: -1,
            total: 0,
            type: 'TICKET',
            receipt: undefined
        }
    }

    public static getEmptyLicenseRequest(): LicenseRequest {
        return {
            employeeId: -1,
            type: '',
            startDate: new Date().toISOString(),
            endDate: new Date().toISOString()
        }
    }

}