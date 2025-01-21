import { Component, inject } from '@angular/core';
import { UserappService } from '../../../_services/userapp.service';
import { TicketService } from '../../../_services/ticket.service';
import { ActivatedRoute } from '@angular/router';
import { OnInit } from '@angular/core';
import { Ticket } from '../../../_models/ticket';
import { TableModule } from 'primeng/table';
import { NgFor } from '@angular/common';
import { NgIf } from '@angular/common';
import { userApp } from '../../../_models/userapp';
import { AccountService } from '../../../_services/account.service';


@Component({
  selector: 'app-tickets-company-list',
  standalone: true,
  imports: [TableModule,NgFor,NgIf],
  templateUrl: './tickets-company-list.component.html',
  styleUrl: './tickets-company-list.component.css'
})
export class TicketsCompanyListComponent implements OnInit {
  ticketService = inject(TicketService);
  route = inject(ActivatedRoute);
  userappService = inject(UserappService);
  accountService = inject(AccountService);

  tickets: Ticket[] = [];
  contractId: number | null = null;
  handlers: { [key: number]: userApp | null } = {}; // Store handler details by their IDs
  loading = true;


  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.contractId = +params['id']; // Extract contract ID from the URL
      if (this.contractId) {
        this.loadTickets(this.contractId);
      }
    });
  }


  loadTickets(contractId: number): void {
    this.ticketService.getTicketsByContractId(contractId).subscribe({
      next: tickets => {
        this.tickets = tickets;
        this.loading = false;

        // Load handler details for tickets with a handlerId
        this.tickets
          .filter(ticket => ticket.handlerId)
          .forEach(ticket => this.loadHandler(ticket.handlerId!));
      },
      error: err => {
        console.error('Error fetching tickets:', err);
        this.loading = false;
      }
    });
  }



  loadHandler(handlerId: number): void {
    if (!this.handlers[handlerId]) {
      this.userappService.getUserappById(handlerId).subscribe({
        next: (user) => {
          if (user) {
            this.handlers[handlerId] = user;
          } else {
            console.warn(`Handler with ID ${handlerId} not found.`);
            this.handlers[handlerId] = null; // Mark as not found
          }
        },
        error: (err) => console.error(`Error fetching user with ID ${handlerId}:`, err),
      });
    }
  }

  takeOverTicket(ticketId: number): void {
    const currentUsername = this.accountService.currentUser()?.userName; // Fetch current user username
    if (!currentUsername) {
      console.error('Current user username not found.');
      return;
    }
  
    // Fetch current user's details
    this.userappService.getUsersapp_username(currentUsername).subscribe({
      next: (userApp) => {
        const handlerId = userApp.id;
        this.ticketService.takeOverTicket(ticketId, handlerId).subscribe({
          next: () => {
            console.log(`Ticket ${ticketId} successfully taken over.`);
  
            // Update the handler details locally for instant UI updates
            this.handlers[handlerId] = userApp;
  
            // Update the specific ticket's handlerId
            const ticket = this.tickets.find((t) => t.id === ticketId);
            if (ticket) {
              ticket.handlerId = handlerId;
            }
          },
          error: (err) => console.error('Error taking over ticket:', err),
        });
      },
      error: (err) => console.error('Error fetching user app details:', err),
    });
  }
  
  
}
