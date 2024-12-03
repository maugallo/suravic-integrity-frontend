import { PercentagesRequest, PercentagesResponse } from "../models/percentages.model";
export class PercentagesMapper {

    public static toPercentagesRequest(percentages: PercentagesResponse): PercentagesRequest {
        return {
            vatPercentage: percentages.vatPercentage,
            profitPercentage: percentages.profitPercentage,
            perceptionPercentage: percentages.perceptionPercentage,
            grossIncomePercentage: percentages.grossIncomePercentage
        };
    }

}