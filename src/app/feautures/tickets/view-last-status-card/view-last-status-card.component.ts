import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TicketStatusHistory } from '../../../_models/ticketstatushistory';
import { NgIf, NgStyle } from '@angular/common';
import { NgFor } from '@angular/common';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { BadgeModule } from 'primeng/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { TicketService } from '../../../_services/ticket.service';
import { MatBadgeModule } from '@angular/material/badge';
import { AccountService } from '../../../_services/account.service';
import { OnInit } from '@angular/core';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TicketAttachment } from '../../../_services/ticketattachment';



@Component({
  selector: 'app-view-last-status-card',
  standalone: true,
  imports: [NgFor,NgIf,DatePipe,MatCardModule
    ,NgStyle,BadgeModule,MatButtonModule,MatIcon,MatBadgeModule,
    OverlayPanelModule,ProgressSpinnerModule],
  templateUrl: './view-last-status-card.component.html',
  styleUrl: './view-last-status-card.component.css'
})
export class ViewLastStatusCardComponent implements OnInit {
  @Input() statusHistory!: TicketStatusHistory;
  @Output() statusUpdated = new EventEmitter<void>();  // Emits event when seen

  loggedInUsername: string = '';
  attachments: TicketAttachment[] = [];
  loading = false;
  constructor(private ticketService: TicketService, private accountService: AccountService) {}

  ngOnInit(): void {
    this.loggedInUsername = this.accountService.currentUser()?.userName ?? '';
  }

  getStatusColor(status: string): string {
    const rootStyles = getComputedStyle(document.documentElement);
    switch (status.toLowerCase()) {
      case 'open': return rootStyles.getPropertyValue('--status-open').trim();
      case 'inprogress': return rootStyles.getPropertyValue('--status-inprogress').trim();
      case 'resolved': return rootStyles.getPropertyValue('--status-resolved').trim();
      case 'closed': return rootStyles.getPropertyValue('--status-closed').trim();
      default: return '#000000'; 
    }
  }

  getBellColor(): string {
    return this.statusHistory.seen ? 'green' : 'red'; // Green if seen, Red if new
  }

  toggleOverlay(event: MouseEvent, overlay: any): void {
  this.loading = true;
  overlay.toggle(event);

  this.ticketService.getStatusHistoryAttachments(this.statusHistory.id).subscribe({
    next: (res) => {
      this.attachments = res;
      this.loading = false;
    },
    error: (err) => {
      console.error('Error loading attachments:', err);
      this.attachments = [];
      this.loading = false;
    }
  });
}


  markAsSeen(): void {
    if (!this.statusHistory.seen) {
      const markSeenDto = {
        message: this.statusHistory.message || '',
        updatedAt: this.statusHistory.updatedAt,
        updatedByUsername: this.statusHistory.updatedByUsername
      };

      this.ticketService.markStatusAsSeen(markSeenDto).subscribe({
        next: () => {
          this.statusUpdated.emit(); 
        },
        error: err => console.error('Error marking status as seen:', err)
      });
    }
}

}
