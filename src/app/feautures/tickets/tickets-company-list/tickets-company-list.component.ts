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
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { TicketContractsParams } from '../../../_models/ticketcontractsparams';
import {MatCardModule} from '@angular/material/card';
import { FormsModule } from '@angular/forms';
import { PaginatedResult } from '../../../_models/pagination';

@Component({
  selector: 'app-tickets-company-list',
  standalone: true,
  imports: [TableModule,NgFor,NgIf,MatCardModule,
    MatPaginatorModule,MatButtonModule,MatButtonToggleModule,
    MatInputModule,MatSelectModule,MatFormFieldModule,FormsModule],
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
  pagination: any;
  ticketParams: TicketContractsParams = new TicketContractsParams();
  userType = this.accountService.currentUser()?.userType;





  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.contractId = +params['id'];
      if (this.contractId) {
        this.loadTickets();
      }
    });
  }


  
  loadTickets(): void {
    if (!this.contractId) return;
    this.loading = true;
    this.ticketService.getTicketsByContractId(this.contractId, this.ticketParams).subscribe({
      next: (paginatedResult: PaginatedResult<Ticket[]>) => {
        this.tickets = paginatedResult.items ?? [];
        this.pagination = paginatedResult.pagination;
        this.loading = false;
        // Load handler details for tickets that have a handlerId
        this.tickets.filter(ticket => ticket.handlerId)
          .forEach(ticket => this.loadHandler(ticket.handlerId!));
      },
      error: err => {
        console.error('Error fetching tickets:', err);
        this.loading = false;
      }
    });
  }

  applyFilters(): void {
    this.ticketParams.pageNumber = 1; // Reset to the first page on filter change
    this.loadTickets();
  }

  resetFilters(): void {
    this.ticketParams = new TicketContractsParams();
    this.loadTickets();
  }

  pageChanged(event: any): void {
    this.ticketParams.pageNumber = Math.floor(event.first / event.rows) + 1;
    this.ticketParams.pageSize = event.rows;
    this.loadTickets();
  }


  loadHandler(handlerId: number): void {
    if (!this.handlers[handlerId]) {
      this.userappService.getUserappById(handlerId).subscribe({
        next: (user) => { this.handlers[handlerId] = user; },
        error: (err) => console.error(`Error fetching user with ID ${handlerId}:`, err)
      });
    }
  }

  trackTicket(index: number, ticket: Ticket): number {
    return ticket.id;
  }

 

  takeOverTicket(ticketId: number): void {
    const currentUsername = this.accountService.currentUser()?.userName; // Fetch current user username
    if (!currentUsername) {
      console.error('Current user username not found.');
      return;
    }

    this.userappService.getUsersapp_username(currentUsername).subscribe({
      next: (userApp) => {
        const handlerId = userApp.id;
        this.ticketService.takeOverTicket(ticketId, handlerId).subscribe({
          next: () => {
            console.log(`Ticket ${ticketId} successfully taken over.`);
  
      
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
