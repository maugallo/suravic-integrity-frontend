import { ContactRequest, ContactResponse } from "../models/contact.model";

export class ContactMapper {

    public static toContactRequest(contact: ContactResponse): ContactRequest {
        return {
            telephone: contact.telephone,
            email: contact.email
        };
    }

}