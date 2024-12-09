import { ContactRequest, ContactResponse } from "src/app/shared/models/contact.model";
import { PercentagesRequest, PercentagesResponse } from "src/app/shared/models/percentages.model";
import { SectorResponse } from "src/app/modules/sectors/models/sector.model";

export interface ProviderRequest {
    sectorId: number,
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