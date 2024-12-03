import { LicenseRequest, LicenseResponse } from "src/app/modules/rests/licenses/models/license.model"

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