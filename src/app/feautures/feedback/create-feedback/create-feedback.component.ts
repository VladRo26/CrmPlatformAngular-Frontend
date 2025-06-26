import { Component, HostListener, inject, ViewChild } from '@angular/core';
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
import { ProgressSpinnerModule } from 'primeng/progressspinner';


@Component({
  selector: 'app-create-feedback',
  standalone: true,
  imports: [NgFor, NgIf, ReactiveFormsModule,MatFormFieldModule,
    MatInputModule,MatButtonModule,MatSelectModule,MatSliderModule,
    FormsModule,RatingModule,DragDropModule,CommonModule,OverlayPanelModule,
    ProgressBarModule,ButtonModule,ProgressSpinnerModule],
  templateUrl: './create-feedback.component.html',
  styleUrl: './create-feedback.component.css'
})
export class CreateFeedbackComponent implements OnInit {

  overlayWidth = window.innerWidth < 640 ? '95vw' : (window.innerWidth < 1024 ? '32rem' : '40rem');
  isMobile = window.innerWidth <= 1280;


  @HostListener('window:resize', [])
  onResize() {
    const w = window.innerWidth;
    this.overlayWidth = w < 640 ? '95vw' : (w < 1024 ? '32rem' : '40rem');
    this.isMobile = w <= 1280;

  }

  


  feedbackService = inject(FeedbackService);
  ticketService = inject(TicketService);
  userappService = inject(UserappService);
  beneficiaryCompanyService = inject(BeneficiarycompanyService);
  accountService = inject(AccountService);
  toastr = inject(ToastrService);
  isSubmitting: boolean = false;



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
  handlerUserName: string | null = null;

  ngOnInit(): void {
      this.currentUserName = this.accountService.currentUser()?.userName ?? '';
      this.fetchFeedbackTicketsByUserName();
      this.initForm();
  }

  handlerUserNames: { [key: number]: string } = {}; // Store handler usernames dynamically

fetchFeedbackTicketsByUserName(): void {
  if (!this.currentUserName) {
    this.toastr.error('User is not logged in.');
    return;
  }

  this.ticketService.getFeedbackTicketsByUserName(this.currentUserName).subscribe({
    next: (data) => {
      console.log("API Response Data:", data);

      this.tickets = data;
      this.isDropdownDisabled = this.tickets.length === 0;

      if (this.isDropdownDisabled) {
        this.toastr.warning(`No feedback-eligible tickets found for user: ${this.currentUserName}`);
      } else {
        // Fetch handler usernames dynamically
        this.tickets.forEach(ticket => {
          if (ticket.handlerId && !this.handlerUserNames[ticket.handlerId]) {
            this.fetchHandlerUsername(ticket.handlerId);
          }
        });
      }
    },
    error: (err) => {
      console.error('Error fetching feedback-eligible tickets:', err);
      this.toastr.error('Failed to fetch tickets.');
    },
  });
}

  
  

fetchHandlerUsername(handlerId: number): void {
  if (!handlerId) return;

  this.userappService.getUserappById(handlerId).subscribe({
    next: (user: userApp | null) => {
      this.handlerUserNames[handlerId] = user ? user.userName : 'No Handler'; // Store username dynamically
    },
    error: (err) => {
      console.error(`Error fetching handler details for handlerId ${handlerId}:`, err);
      this.handlerUserNames[handlerId] = 'No Handler';
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
  
    this.isSubmitting = true;
  
    const { ticketId, content, rating } = this.feedbackForm.value;
  
    this.feedbackService.createFeedback(this.currentUserName, ticketId, content, rating).subscribe({
      next: (feedback: Feedback) => {
        this.toastr.success('Feedback submitted successfully!');
        this.feedbackForm.reset();
  
        // Refresh page after delay
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      },
      error: (err) => {
        console.error('Error submitting feedback:', err);
        this.toastr.error('Failed to submit feedback.');
      },
      complete: () => {
        this.isSubmitting = false;
      }
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
    const ticketId = this.feedbackForm.get('ticketId')?.value;
    const rating = this.feedbackForm.get('rating')?.value;

    if (!ticketId || !rating) {
        this.toastr.error("Please select a ticket and rating before generating feedback.");
        return;
    }

    const selectedTicket = this.tickets.find(ticket => ticket.id === Number(ticketId));

    if (!selectedTicket) {
        this.toastr.error("Invalid ticket selected.");
        return;
    }

    if (!selectedTicket.handlerId) {
        this.toastr.error("No handler assigned to this ticket.");
        return;
    }

    const handlerId = selectedTicket.handlerId;

    // ✅ Check if handler username is already stored
    if (this.handlerUserNames[handlerId]) {
        this.processFeedbackGeneration(this.handlerUserNames[handlerId], ticketId, rating);
    } else {
        // ✅ Fetch handler username if not already stored
        this.userappService.getUserappById(handlerId).subscribe({
            next: (user: userApp | null) => {
                if (user) {
                    this.handlerUserNames[handlerId] = user.userName;
                    this.processFeedbackGeneration(user.userName, ticketId, rating);
                } else {
                    this.toastr.error("Handler not found.");
                }
            },
            error: (err) => {
                console.error(`Error fetching handler details for handlerId ${handlerId}:`, err);
                this.toastr.error("Error retrieving handler information.");
            }
        });
    }
}


private processFeedbackGeneration(handlerUsername: string, ticketId: number, rating: number): void {
    this.isGenerating = true;
    this.generatedFeedback = ''; // Clear previous feedback

    this.feedbackService.generateFeedbackForUser(
        handlerUsername,
        ticketId,
        rating,
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
