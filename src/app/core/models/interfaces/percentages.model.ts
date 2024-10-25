export interface PercentagesRequest {
    vatPercentage: string,
    profitPercentage: string,
    perceptionPercentage: string,
    grossIncomePercentage: string
}

export interface PercentagesResponse {
    id: number,
    vatPercentage: string,
    profitPercentage: string,
    perceptionPercentage: string,
    grossIncomePercentage: string
}