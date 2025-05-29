export interface CreateTicket {
    title?: string; // Optional
    description?: string; // Optional
    status: string; // Required
    priority?: string; // Optional
    type?: string; // Optional
    contractId: number; // Required
    creatorId: number; // Required
    language?: string; // Optional
    languageCode?: string; // Language code of the ticket (optional)
    countryCode?: string; // Optional
    attachments?: File[]; 
  }
  