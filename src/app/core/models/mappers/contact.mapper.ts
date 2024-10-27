import { ContactRequest, ContactResponse } from "../interfaces/contact.model";

export class ContactMapper {

    public static toContactRequest(contact: ContactResponse): ContactRequest {
        return {
            telephone: contact.telephone,
            email: contact.email
        };
    }

}