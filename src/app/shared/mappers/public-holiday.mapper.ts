import { PublicHolidayRequest, PublicHolidayResponse } from "src/app/modules/public-holidays/models/public-holiday.model"

export class PublicHolidayMapper {

    public static toPublicHolidayRequest(publicHoliday: PublicHolidayResponse): PublicHolidayRequest {
        return {
            reason: publicHoliday.reason,
            date: publicHoliday.date,
            shiftIds: publicHoliday.shifts.map(shift => shift.id)
        }
    }

}