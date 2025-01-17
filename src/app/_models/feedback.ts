export interface Feedback {
    id: number;
    fromUserId: number; // ID of the user who gave the feedback
    toUserId: number;   // ID of the user receiving the feedback
    ticketId?: number;  // Optional ticket ID associated with the feedback
    content?: string;   // Optional feedback content
    rating: number;     // Rating between 1 and 5
    createdAt: Date;    // Date when the feedback was created
  }
  