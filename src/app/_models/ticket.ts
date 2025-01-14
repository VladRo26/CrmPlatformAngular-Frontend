import { TicketStatus } from "../_enum/TicketStatus";

export interface Ticket {
    id: number; // Ticket ID
    title: string | null; // Title of the ticket (optional)
    description: string | null; // Description of the ticket (optional)
    status: TicketStatus; // Enum for the ticket status
    priority: string | null; // Priority of the ticket (optional)
    type: string | null; // Type of the ticket (optional)
    contractId: number; // Contract ID (required)
    creatorId: number; // Creator ID (required)
    handlerId?: number; // Handler ID (optional)
  }