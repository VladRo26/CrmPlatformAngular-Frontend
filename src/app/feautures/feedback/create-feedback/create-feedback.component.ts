import { Component, inject, ViewChild } from '@angular/core';
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
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { ProgressBarModule } from 'primeng/progressbar';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-create-feedback',
  standalone: true,
  imports: [NgFor, NgIf, ReactiveFormsModule,MatFormFieldModule,
    MatInputModule,MatButtonModule,MatSelectModule,MatSliderModule,
    FormsModule,RatingModule,DragDropModule,CommonModule,OverlayPanelModule,ProgressBarModule,ButtonModule],
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


  @ViewChild('feedbackOverlay') feedbackOverlay!: OverlayPanel;


  tickets: Ticket[] = [];
  feedbackForm: FormGroup = new FormGroup({});
  currentUserName: string = '';
  companyName: string = '';
  handlerUser?: userApp; // Store handler user details
  isDropdownDisabled: boolean = true; // Disable dropdown initially
  userExperience: string = ''; // Stores user experience input
  isGenerating = false;
  generatedFeedback: string | null = null;

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
        console.log("API Response Data:", data); // Log full response
    
        this.tickets = data.filter(
          (ticket) =>
            ticket.handlerId !== null &&
            ticket.status?.toLowerCase() === 'closed' // Ensure status is not null
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
      content: new FormControl({ value: '', disabled: true }, [Validators.required, Validators.minLength(10)]), // Initially disabled
      rating: new FormControl(0, [Validators.required, Validators.min(1), Validators.max(5)]),
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

  enableMessageInput(): void {
    const ratingControl = this.feedbackForm.get('rating');
    const contentControl = this.feedbackForm.get('content');
  
    if (ratingControl?.value >= 1) {
      contentControl?.enable(); // Enable textarea only when rating is 1 or more
    } else {
      contentControl?.disable(); // Keep disabled when rating is 0
    }
  }

  openFeedbackOverlay(event: Event): void {
    this.generatedFeedback = null;
    this.userExperience = '';
    this.feedbackOverlay.toggle(event);
  }

  generateFeedback(): void {
    if (!this.feedbackForm.get('rating')?.value) {
      this.toastr.error("Please select a rating before generating feedback.");
      return;
    }
  
    this.isGenerating = true;
    this.generatedFeedback = ''; // Clear previous feedback
  
    this.feedbackService.generateFeedbackForUser(
      this.currentUserName,
      this.feedbackForm.get('ticketId')?.value,
      this.feedbackForm.get('rating')?.value,
      this.userExperience
    ).subscribe({
      next: (feedback) => {
        this.generatedFeedback = feedback;
        this.toastr.success("Feedback generated successfully!");
  
        // Automatically fill the textarea with the generated feedback
        this.feedbackForm.get('content')?.setValue(feedback);
      },
      error: (err) => {
        console.error("Error generating feedback:", err);
        this.toastr.error("Failed to generate feedback.");
      },
      complete: () => {
        this.isGenerating = false;
      }
    });
  }
  

}
