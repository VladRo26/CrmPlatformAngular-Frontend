import { Component, inject } from '@angular/core';
import { Ticket } from '../../../_models/ticket';
import { TicketService } from '../../../_services/ticket.service';
import { AccountService } from '../../../_services/account.service';
import { OnInit} from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { TicketsCardComponent } from '../tickets-card/tickets-card.component';

@Component({
  selector: 'app-tickets-list',
  standalone: true,
  imports: [NgFor, NgIf, TicketsCardComponent],
  templateUrl: './tickets-user-list.component.html',
  styleUrl: './tickets-user-list.component.css'
})
export class TicketsUserListComponent implements OnInit {
  tickets: Ticket[] = [];
  ticketService = inject(TicketService);
  accountService = inject(AccountService);
  username = this.accountService.currentUser()?.userName;

  ngOnInit(): void {
    this.loadTickets();
  }

  loadTickets(): void {
    this.ticketService.getTicketsByHandlerUsername(this.username ?? '').subscribe({
      next: (data) => {
        this.tickets = data; // Assign fetched tickets to the array
        console.log('Tickets loaded:', this.tickets);
      },
      error: (err) => {
        console.error('Error loading tickets:', err);
      }
    });
  }

}
