import { Component, inject,OnInit } from '@angular/core';
import { AccountService } from '../../../_services/account.service';
import { userApp } from '../../../_models/userapp';
import { Ticket } from '../../../_models/ticket';
import { TicketService } from '../../../_services/ticket.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserappService } from '../../../_services/userapp.service';
import { NgFor, NgIf } from '@angular/common';
import { PageChangedEvent, PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { TicketsUserappCardComponent } from '../../tickets-userapp-card/tickets-userapp-card.component';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-ticket-preview',
  standalone: true,
  imports: [
    NgFor, NgIf, PaginationModule
    ,FormsModule,MatSelectModule,MatFormFieldModule,
    MatInputModule,MatButtonModule,MatButtonToggleModule,MatCardModule,
    TicketsUserappCardComponent,ButtonModule
  ],
  templateUrl: './ticket-preview.component.html',
  styleUrl: './ticket-preview.component.css'
})
export class TicketPreviewComponent implements OnInit {
 tickets: Ticket[] = [];
  ticketService = inject(TicketService);
  accountService = inject(AccountService);
  router = inject(Router);
  route = inject(ActivatedRoute);
  userAppService = inject(UserappService);
  username: string = '';
  userDetails?: userApp;

 
 
     ticketParams = this.ticketService.ticketParams();
     pagination: any = null;
 
     ngOnInit(): void {
       const Username = this.accountService.currentUser()?.userName;
       if (Username) {
         this.username = Username;
       } else {
         console.error('Username parameter is missing');
         return;
       }
       this.userAppService.getUsersapp_username(this.username).subscribe({
         next: (user) => {
           this.userDetails = user;
           console.log('Fetched user details:', this.userDetails);
           // Now load tickets using the username from the full user details.
           this.loadTickets();
         },
         error: (err) => {
           console.error('Error fetching user details:', err);
         }
       });
     }
   
 
     loadTickets(): void {
       this.ticketParams.username = this.userDetails?.userName || this.username;
       this.ticketService.getTicketsByUserName().subscribe({
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
 
     resetFilters(): void {
       // Reset filter values to defaults.
       this.ticketParams.status = 'notClosed';
       this.ticketParams.priority = '';
       this.ticketParams.title = '';
       this.ticketParams.orderBy = 'date';
       this.ticketParams.pageNumber = 1;
       this.loadTickets();
     }
 
     trackTicket(index: number, ticket: Ticket): number {
       return ticket.id;
     }
 
 

}
