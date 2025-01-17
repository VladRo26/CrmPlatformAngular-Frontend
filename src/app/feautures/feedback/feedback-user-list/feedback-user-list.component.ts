import { Component, inject, Input } from '@angular/core';
import { Feedback } from '../../../_models/feedback';
import { OnInit } from '@angular/core';
import { FeedbackService } from '../../../_services/feedback.service';
import { FeedbackCardComponent } from '../feedback-card/feedback-card.component';

@Component({
  selector: 'app-feedback-user-list',
  standalone: true,
  imports: [FeedbackCardComponent],
  templateUrl: './feedback-user-list.component.html',
  styleUrl: './feedback-user-list.component.css'
})
export class FeedbackUserListComponent implements OnInit {
  @Input() userId!: number; // Input property for the user ID
  feedbacks: Feedback[] = [];
  feedbackService = inject(FeedbackService);

  ngOnInit(): void {
    this.loadFeedbacks();
  }

  loadFeedbacks(): void {
    this.feedbackService.getFeedbackByToUserId(this.userId).subscribe({
      next: (data) => {
        this.feedbacks = data; // Assign fetched feedbacks to the array
        console.log('Feedbacks loaded:', this.feedbacks);
      },
      error: (err) => {
        console.error('Error loading feedbacks:', err);
      },
    });
  }

}
