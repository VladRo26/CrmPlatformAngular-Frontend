import { TicketStatus } from "../_enum/TicketStatus";

export interface Ticket {
    id: number; // Ticket ID
    title: string | null; // Title of the ticket (optional)
    description: string | null; // Description of the ticket (optional)
    status: string; // Enum for the ticket status
    priority: string | null; // Priority of the ticket (optional)
    type: string | null; // Type of the ticket (optional)
    contractId: number; // Contract ID (required)
    creatorId: number; // Creator ID (required)
    handlerId?: number; // Handler ID (optional)
    language?: string; // Language of the ticket (optional)
    languageCode?: string; // Language code of the ticket (optional)
    countryCode?: string; // Country code of the ticket (optional)
    tLanguage?: string; // Target language of the ticket (optional)
    tLanguageCode?: string; // Target language code of the ticket (optional)
    tCountryCode?: string; // Target country code of the ticket (optional)
    tDescription?: string; // Translated description of the ticket (optional)
  }