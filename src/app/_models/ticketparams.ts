export class TicketParams {
    pageNumber: number = 1; 
    pageSize: number = 2; 
    username?: string; // Filter by username
    status?: string; // Filter by ticket status (e.g., Open, Closed)
    priority?: string; // Filter by priority (e.g., High, Medium, Low)
    title?: string; // Search by ticket title
    orderBy?: string; // Sorting option (e.g., by date)
    sortDirection: string = 'desc';

  }
  