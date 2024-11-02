import { LicenseRequest, LicenseResponse } from "../interfaces/license.model";

export class LicenseMapper {

    public static toLicenseRequest(license: LicenseResponse): LicenseRequest {
        return {
            employeeId: license.employee.id,
            type: license.type,
            startDate: license.startDate,
            endDate: license.endDate
        }
    }

}