import { Component, inject } from '@angular/core';
import { FeedbackService } from '../../../_services/feedback.service';
import { TicketService } from '../../../_services/ticket.service';
import { AccountService } from '../../../_services/account.service';
import { ToastrService } from 'ngx-toastr';
import { Ticket } from '../../../_models/ticket';
import { FormGroup,FormControl,Validators,ReactiveFormsModule } from '@angular/forms';
import { NgFor, NgIf } from '@angular/common';
import { OnInit } from '@angular/core';
import { Feedback } from '../../../_models/feedback';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatSliderModule } from '@angular/material/slider';
import { FormsModule } from '@angular/forms';
import { BeneficiarycompanyService } from '../../../_services/beneficiarycompanies.service';
import { BeneficiaryCompany } from '../../../_models/beneficiarycompany';
import { RatingModule } from 'primeng/rating';
import { DragDropModule } from 'primeng/dragdrop';
import { userApp } from '../../../_models/userapp';
import { UserappService } from '../../../_services/userapp.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create-feedback',
  standalone: true,
  imports: [NgFor, NgIf, ReactiveFormsModule,MatFormFieldModule,
    MatInputModule,MatButtonModule,MatSelectModule,MatSliderModule,FormsModule,RatingModule,DragDropModule,CommonModule],
  templateUrl: './create-feedback.component.html',
  styleUrl: './create-feedback.component.css'
})
export class CreateFeedbackComponent implements OnInit {

  feedbackService = inject(FeedbackService);
  ticketService = inject(TicketService);
  userappService = inject(UserappService);
  beneficiaryCompanyService = inject(BeneficiarycompanyService);
  accountService = inject(AccountService);
  toastr = inject(ToastrService);


  tickets: Ticket[] = [];
  feedbackForm: FormGroup = new FormGroup({});
  currentUserName: string = '';
  companyName: string = '';
  handlerUser?: userApp; // Store handler user details
  isDropdownDisabled: boolean = true; // Disable dropdown initially

  ngOnInit(): void {
      this.currentUserName = this.accountService.currentUser()?.userName ?? '';
      this.fetchTicketsByUserName();
      this.initForm();
  }

  fetchTicketsByUserName(): void {
    if (!this.currentUserName) {
      this.toastr.error('User is not logged in.');
      return;
    }

    this.ticketService.getTicketsByUserName(this.currentUserName).subscribe({
      next: (data) => {
        this.tickets = data.filter(
          (ticket) =>
            ticket.handlerId !== null &&
            (ticket.status.toLowerCase() === 'resolved' || ticket.status.toLowerCase() === 'closed')
        );

        // Disable dropdown if no valid tickets
        this.isDropdownDisabled = this.tickets.length === 0;

        if (this.isDropdownDisabled) {
          this.toastr.warning(`No valid tickets found for user: ${this.currentUserName}`);
        }
      },
      error: (err) => {
        console.error('Error fetching tickets:', err);
        this.toastr.error('Failed to fetch tickets.');
      },
    });
  }


  fetchHandlerDetails(handlerId: number): void {
    if (!handlerId) {
      this.handlerUser = undefined; // Clear handler details if no handlerId
      return;
    }
  
    this.userappService.getUserappById(handlerId).subscribe({
      next: (user: userApp | null) => {
        if (user) {
          this.handlerUser = user; // Store handler user details
        } else {
          this.toastr.warning('Handler details not found.');
          this.handlerUser = undefined;
        }
      },
      error: (err) => {
        console.error('Error fetching handler details:', err);
        this.toastr.error('Failed to fetch handler details.');
        this.handlerUser = undefined;
      },
    });
  }
  
  

  initForm(): void {
    this.feedbackForm = new FormGroup({
      ticketId: new FormControl('', Validators.required),
      content: new FormControl('', [Validators.required, Validators.minLength(10)]),
      rating: new FormControl(5, [Validators.required, Validators.min(1), Validators.max(5)]),
    });
  }


  submitFeedback(): void {
    if (this.feedbackForm.invalid) {
      this.toastr.error('Please fill all required fields.');
      return;
    }

    const { ticketId, content, rating } = this.feedbackForm.value;

    this.feedbackService.createFeedback(this.currentUserName, ticketId, content, rating).subscribe({
      next: (feedback: Feedback) => {
        this.toastr.success('Feedback submitted successfully!');
        this.feedbackForm.reset();
      },
      error: (err) => {
        console.error('Error submitting feedback:', err);
        this.toastr.error('Failed to submit feedback.');
      },
    });
  }

}
