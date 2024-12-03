import { ShiftRequest, ShiftResponse } from "src/app/modules/shifts/models/shift.model";
export class ShiftMapper {

    public static toShiftRequest(shift: ShiftResponse): ShiftRequest {
        return {
            name: shift.name,
            startTime: shift.startTime,
            endTime: shift.endTime
        };
    }

}