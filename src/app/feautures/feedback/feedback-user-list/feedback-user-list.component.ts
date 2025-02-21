import { Component, inject, Input } from '@angular/core';
import { Feedback } from '../../../_models/feedback';
import { OnInit } from '@angular/core';
import { FeedbackService } from '../../../_services/feedback.service';
import { FeedbackCardComponent } from '../feedback-card/feedback-card.component';
import { NgIf } from '@angular/common';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-feedback-user-list',
  standalone: true,
  imports: [FeedbackCardComponent,NgIf,NgFor],
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
        this.feedbacks = data;
        console.log('Feedbacks loaded:', this.feedbacks);
      },
      error: (err) => {
        console.error('Error loading feedbacks:', err);
      },
    });
  }

  // TrackBy function to optimize ngFor rendering
  trackFeedback(index: number, feedback: Feedback): number {
    return feedback.id;
  }

}
