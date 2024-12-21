import { ContactRequest, ContactResponse } from "src/app/shared/models/contact.model";
import { PercentagesRequest, PercentagesResponse } from "src/app/shared/models/percentages.model";
import { SectorResponse } from "src/app/modules/sectors/models/sector.model";
import { BaseEntity } from "src/app/shared/models/base-entity.model";

export interface ProviderRequest extends BaseEntity {
    sectorId: number,
    contact: ContactRequest,
    percentages: PercentagesRequest,
    vatCondition: string,
    companyName: string,
    firstName: string,
    lastName: string,
    cuit: string
}

export interface ProviderResponse extends BaseEntity {
    sector: SectorResponse,
    contact: ContactResponse,
    percentages: PercentagesResponse,
    vatCondition: string,
    companyName: string,
    firstName: string,
    lastName: string,
    cuit: string
}