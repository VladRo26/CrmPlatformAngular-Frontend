export interface TicketStatusHistory {
    status: string; // Status is required and has a max length of 50 characters.
    message?: string; // Optional message field with a max length of 500 characters.
    updatedByUsername: string; // Required ID of the user who updated the ticket.
    updatedAt: Date;
    ticketUserRole: string; // Required role of the updater (e.g., Creator/Handler).
    seen: boolean; // New property to track if the update has been seen
  }