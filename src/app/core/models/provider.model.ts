import { ContactRequest, ContactResponse } from "./contact.model";
import { PercentagesRequest, PercentagesResponse } from "./percentages.model";
import { SectorResponse } from "./sector.model";

export interface ProviderRequest {
    sector: SectorResponse,
    contact: ContactRequest,
    percentages: PercentagesRequest,
    vatCondition: string,
    companyName: string,
    firstName: string,
    lastName: string,
    cuit: string
}

export interface ProviderResponse {
    id: number,
    sector: SectorResponse,
    contact: ContactResponse,
    percentages: PercentagesResponse,
    vatCondition: string,
    companyName: string,
    firstName: string,
    lastName: string,
    cuit: string,
    isEnabled: boolean
}