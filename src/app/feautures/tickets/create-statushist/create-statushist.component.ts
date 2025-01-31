import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { TicketService } from '../../../_services/ticket.service';
import { ToastrService } from 'ngx-toastr';
import { OnInit } from '@angular/core';
import { AccountService } from '../../../_services/account.service';
import { NgFor } from '@angular/common';
@Component({
  selector: 'app-create-statushist',
  standalone: true,
  imports: [ReactiveFormsModule,FormsModule,NgFor],
  templateUrl: './create-statushist.component.html',
  styleUrl: './create-statushist.component.css'
})
export class CreateStatushistComponent implements OnInit {
  @Input() ticketId!: number; // Ticket ID passed from parent
  @Input() username!: string; // Username of the current user
  @Output() statusUpdated = new EventEmitter<void>(); // Event emitter to notify parent after status update
  @Output() closeDialog = new EventEmitter<void>(); // Event emitter to close the dialog
  ticketService = inject(TicketService);
  accountService = inject(AccountService);
  toastr = inject(ToastrService);


  statuses = [
    { label: 'Open', value: 'Open' },
    { label: 'In Progress', value: 'InProgress' },
    { label: 'Resolved', value: 'Resolved' },
    { label: 'Closed', value: 'Closed' },
  ];

  updateStatusForm!: FormGroup;

  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm(): void {
    this.updateStatusForm = new FormGroup({
      status: new FormControl(this.statuses[0]?.value || '', Validators.required), // Default to the first status
      message: new FormControl('', [Validators.maxLength(500)]),
    });
  }

  getUserRole(): string {
    const currentUser = this.accountService.currentUser();
    if (!currentUser) {
      this.toastr.error('Current user is not available.');
      throw new Error('Current user is not available.');
    }
  
    return currentUser.userType === 'SoftwareCompanyUser' ? 'Handler' : 'Creator';
  }
  
  submitStatusUpdate(): void {
    if (this.updateStatusForm.invalid) {
      this.toastr.error('Please select a valid status and provide a valid message.');
      return;
    }
  
    const { status, message } = this.updateStatusForm.value;
    const userRole = this.getUserRole(); // Get user role dynamically
  
    this.ticketService
      .addTicketStatusHistory(this.ticketId, {
        status: status ?? '',
        message: message ?? '',
        updatedByUsername: this.username,
        updatedAt: new Date(),
        ticketUserRole: userRole,
      })
      .subscribe({
        next: () => {
          this.toastr.success('Status updated successfully!');
          this.statusUpdated.emit(); // Notify `TicketDetailComponent` to refresh
          this.closeDialog.emit(); // Close the dialog
        },
        error: (err) => {
          console.error('Error updating status:', err);
          this.toastr.error('Failed to update status.');
        },
      });
  }

  
}
