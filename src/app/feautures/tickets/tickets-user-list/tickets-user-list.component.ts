import { Component, inject } from '@angular/core';
import { Ticket } from '../../../_models/ticket';
import { TicketService } from '../../../_services/ticket.service';
import { AccountService } from '../../../_services/account.service';
import { OnInit} from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { TicketsCardComponent } from '../tickets-card/tickets-card.component';
import { PageChangedEvent, PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tickets-list',
  standalone: true,
  imports: [NgFor, NgIf, TicketsCardComponent,PaginationModule,
    FormsModule,MatSelectModule,MatFormFieldModule
    ,MatInputModule,MatButtonModule,MatButtonToggleModule,MatCardModule],
  templateUrl: './tickets-user-list.component.html',
  styleUrl: './tickets-user-list.component.css'
})
export class TicketsUserListComponent implements OnInit {
  tickets: Ticket[] = [];
  ticketService = inject(TicketService);
  accountService = inject(AccountService);
  router = inject(Router);
  username = this.accountService.currentUser()?.userName;
  userType = this.accountService.currentUser()?.userType;
  ticketParams = this.ticketService.ticketParams();
  pagination: any = null;

ngOnInit(): void {
  if (!this.username) {
    console.error('Username is not available.');
    return;
  }

  this.ticketService.ticketCache.clear();  
  this.ticketParams.status = 'notClosed';  
  this.loadTickets();                    
}

  
loadTickets(force: boolean = true): void {
  this.ticketParams.username = this.username;
  this.ticketService.getTicketsByUserName(force).subscribe({
    next: (result) => {
      this.tickets = result.items ?? [];
      this.pagination = result.pagination;
    },
    error: (err) => {
      console.error('Error loading tickets:', err);
    }
  });
}

  pageChanged(event: PageChangedEvent): void {
    const page = typeof event === 'number' ? event : event.page;
    if (this.ticketParams.pageNumber !== page) {
      this.ticketParams.pageNumber = page;
      this.loadTickets();
    }
  }

  navigateToFeedback(): void {
    this.router.navigate(['/createFeedback']);
  }


  resetFilters(): void {
    // Reset filter values to defaults.
    this.ticketParams.status = 'notClosed';
    this.ticketParams.priority = '';
    this.ticketParams.title = '';
    this.ticketParams.orderBy = 'date';
    this.ticketParams.pageNumber = 1;
    this.loadTickets();
  }


  // Optional: trackBy function for *ngFor
  trackTicket(index: number, ticket: Ticket): number {
    return ticket.id;
  }

}