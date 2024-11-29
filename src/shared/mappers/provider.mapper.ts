import { ProviderRequest, ProviderResponse } from "src/app/providers/models/provider.model";
import { ContactMapper } from "./contact.mapper";
import { PercentagesMapper } from "./percentages.mapper";

export class ProviderMapper {

    public static toProviderRequest(provider: ProviderResponse): ProviderRequest {
        return {
            sectorId: provider.sector.id,
            contact: ContactMapper.toContactRequest(provider.contact),
            percentages: PercentagesMapper.toPercentagesRequest(provider.percentages),
            vatCondition: provider.vatCondition,
            companyName: provider.companyName,
            firstName: provider.firstName,
            lastName: provider.lastName,
            cuit: provider.cuit
        };
    }

}