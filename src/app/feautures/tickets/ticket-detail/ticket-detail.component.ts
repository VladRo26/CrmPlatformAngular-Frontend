import { Component, inject, OnInit } from '@angular/core';
import { TicketService } from '../../../_services/ticket.service';
import { ActivatedRoute } from '@angular/router';
import { Ticket } from '../../../_models/ticket';
import { TicketStatusHistory } from '../../../_models/ticketstatushistory';
import {MatCardModule} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import { NgIf } from '@angular/common';



@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [MatCardModule,MatTableModule,NgIf],
  templateUrl: './ticket-detail.component.html',
  styleUrl: './ticket-detail.component.css'
})
export class TicketDetailComponent implements OnInit {
  private ticketService = inject(TicketService);
  private route = inject(ActivatedRoute);

  ticket?: Ticket;
  ticketHistory: TicketStatusHistory[] = [];

  displayedColumns: string[] = ['status', 'updatedByUserId', 'ticketUserRole', 'message'];



  ngOnInit(): void {
    this.loadTicketDetails();
  }


  loadTicketDetails() {
    const ticketId = Number(this.route.snapshot.paramMap.get('id'));
    if (ticketId) {
      // Fetch the ticket details
      this.ticketService.getTicketById(ticketId).subscribe({
        next: (ticket) => (this.ticket = ticket),
        error: (err) => console.error('Failed to load ticket details', err),
      });

      // Fetch the ticket history
      this.ticketService.getTicketHistoryById(ticketId).subscribe({
        next: (history) => (this.ticketHistory = history),
        error: (err) => console.error('Failed to load ticket history', err),
      });
    }
  }
}
