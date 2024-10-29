export interface ShiftRequest {
    name: string,
    startTime: string,
    endTime: string
}

export interface ShiftResponse {
    id: number,
    name: string,
    startTime: string,
    endTime: string
}