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



@Component({
  selector: 'app-create-feedback',
  standalone: true,
  imports: [NgFor, NgIf, ReactiveFormsModule,MatFormFieldModule,
    MatInputModule,MatButtonModule,MatSelectModule,MatSliderModule,FormsModule,RatingModule],
  templateUrl: './create-feedback.component.html',
  styleUrl: './create-feedback.component.css'
})
export class CreateFeedbackComponent implements OnInit {

  feedbackService = inject(FeedbackService);
  ticketService = inject(TicketService);
  beneficiaryCompanyService = inject(BeneficiarycompanyService);
  accountService = inject(AccountService);
  toastr = inject(ToastrService);


  tickets: Ticket[] = [];
  feedbackForm: FormGroup = new FormGroup({});
  currentUserName: string = '';
  companyName: string = '';

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
        // Apply frontend filtering: handlerId is not null and status is Resolved or Closed
        this.tickets = data.filter(
          (ticket) =>
            ticket.handlerId !== null &&
            (ticket.status.toLowerCase() === 'resolved' || ticket.status.toLowerCase() === 'closed')
        );
  
        if (this.tickets.length === 0) {
          this.toastr.warning(`No valid tickets found for user: ${this.currentUserName}`);
        }
      },
      error: (err) => {
        console.error('Error fetching tickets:', err);
        this.toastr.error('Failed to fetch tickets.');
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
