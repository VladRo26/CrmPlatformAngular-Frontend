import { Component, inject, Input } from '@angular/core';
import { TicketStatusHistory } from '../../../_models/ticketstatushistory';
import { TicketService } from '../../../_services/ticket.service';
import { AccountService } from '../../../_services/account.service';
import { OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {NgFor} from '@angular/common';
import { NgIf } from '@angular/common';
import { DatePipe } from '@angular/common';
import { ViewLastStatusCardComponent } from '../view-last-status-card/view-last-status-card.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-view-last-status-list',
  standalone: true,
  imports: [
    NgFor,NgIf,ViewLastStatusCardComponent,FormsModule,DatePipe
    ,MatFormFieldModule,MatInputModule,MatButtonModule,ButtonModule
  ],
  templateUrl: './view-last-status-list.component.html',
  styleUrl: './view-last-status-list.component.css'
})
export class ViewLastStatusListComponent {
  private ticketService = inject(TicketService);
  private accountService = inject(AccountService);

  // Array to hold the status history records
  statusHistories: TicketStatusHistory[] = [];

  count: number = 5;

  ngOnInit(): void {
    this.loadStatusHistory();
  }

  // Load the status history from the backend
  loadStatusHistory(): void {
    const username = this.accountService.currentUser()?.userName;
    if (username) {
      this.ticketService.getLastTicketStatusHistoryByUser(username, this.count)
        .subscribe({
          next: (histories: TicketStatusHistory[]) => this.statusHistories = histories,
          error: (err: any) => console.error('Error fetching status history:', err)
        });
    }
  }

  reloadStatusList(): void {
    this.loadStatusHistory();
    setTimeout(() => {}, 0); // Forces UI update
}



  trackByHistory(index: number, history: TicketStatusHistory): number {
    return index; // If your model has an id, return history.id
  }
}
