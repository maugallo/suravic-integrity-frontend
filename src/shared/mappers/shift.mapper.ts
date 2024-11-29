import { ShiftRequest, ShiftResponse } from "../interfaces/shift.model";

export class ShiftMapper {

    public static toShiftRequest(shift: ShiftResponse): ShiftRequest {
        return {
            name: shift.name,
            startTime: shift.startTime,
            endTime: shift.endTime
        };
    }

}