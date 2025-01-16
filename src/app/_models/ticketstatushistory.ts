export interface TicketStatusHistory {
    status: string; // Status is required and has a max length of 50 characters.
    message?: string; // Optional message field with a max length of 500 characters.
    updatedByUserId: number; // Required ID of the user who updated the ticket.
    ticketUserRole: string; // Required role of the updater (e.g., Creator/Handler).
  }