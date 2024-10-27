import { ProviderRequest } from "../interfaces/provider.model";

export class ProviderUtility {

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

}