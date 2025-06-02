import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormControl, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { FormsModule } from '@angular/forms';
import { TicketService } from '../../../_services/ticket.service';
import { ToastrService } from 'ngx-toastr';
import { OnInit } from '@angular/core';
import { AccountService } from '../../../_services/account.service';
import { NgFor } from '@angular/common';
import { NgIf } from '@angular/common';
@Component({
  selector: 'app-create-statushist',
  standalone: true,
  imports: [ReactiveFormsModule,FormsModule,NgFor,NgIf],
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
  selectedFiles: File[] = [];



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
  const defaultStatus = this.statuses.find(s => s.value !== 'Open')?.value || '';

  this.updateStatusForm = new FormGroup({
    status: new FormControl(defaultStatus, Validators.required),
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
  const userRole = this.getUserRole();

  const formData = new FormData();
  formData.append('status', status ?? '');
  formData.append('message', message ?? '');
  formData.append('updatedByUsername', this.username);
  formData.append('updatedAt', new Date().toISOString());
  formData.append('ticketUserRole', userRole);
  formData.append('seen', 'false');

  this.selectedFiles.forEach(file => {
    formData.append('attachments', file); // backend expects plural
  });

  this.ticketService.addTicketStatusHistory(this.ticketId, formData).subscribe({
    next: () => {
      this.toastr.success('Status updated successfully!');
      this.updateStatusForm.get('message')?.reset();
      this.selectedFiles = [];
      this.statusUpdated.emit();
      this.closeDialog.emit();
    },
    error: (err) => {
      console.error('Error updating status:', err);
      this.toastr.error('Failed to update status.');
    },
  });
}

onFilesSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (!input.files) return;

  const maxSizeMB = 10;
  const allowedExtensions = ['pdf', 'jpg', 'jpeg', 'png', 'zip'];

  Array.from(input.files).forEach(file => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    const sizeMB = file.size / (1024 * 1024); // Convert size to MB

    if (!ext || !allowedExtensions.includes(ext)) {
      this.toastr.warning(`File type not allowed: ${file.name}`);
      return;
    }

    if (sizeMB > maxSizeMB) {
      this.toastr.error(`File too large: ${file.name} exceeds ${maxSizeMB}MB`);
      return;
    }

    this.selectedFiles.push(file);
  });

  input.value = ''; 
}


removeFile(index: number): void {
  this.selectedFiles.splice(index, 1);
}

  
}
