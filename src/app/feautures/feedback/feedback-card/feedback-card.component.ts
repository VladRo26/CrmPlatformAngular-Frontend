import { Component, inject, input } from '@angular/core';
import { Feedback } from '../../../_models/feedback';
import {MatCardModule} from '@angular/material/card';
import { DatePipe } from '@angular/common';
import { FeedbackSentiment } from '../../../_models/feedbacksentiment';
import { OnInit } from '@angular/core';
import { FeedbackService } from '../../../_services/feedback.service';
import { NgIf } from '@angular/common';
import { PercentPipe } from '@angular/common';
import { MeterGroupModule } from 'primeng/metergroup';
import { UserappService } from '../../../_services/userapp.service';
import { userApp } from '../../../_models/userapp';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-feedback-card',
  standalone: true,
  imports: [MatCardModule,DatePipe,NgIf,PercentPipe,
    MeterGroupModule,RatingModule,FormsModule],
  templateUrl: './feedback-card.component.html',
  styleUrl: './feedback-card.component.css'
})
export class FeedbackCardComponent implements OnInit {
  feedback = input.required<Feedback>();
  sentiment: FeedbackSentiment | null = null;
  feedbackService = inject(FeedbackService);
  userAppService = inject(UserappService); // Inject UserappService
  userApp: userApp | null = null; // User details for the feedback
  value: any[] = [];
  photoUrl: string = '/user.png'; 

  ngOnInit(): void {
    this.loadSentiment();
    this.loadUserDetails();
  }

  private loadSentiment(): void {
    // Call the API to fetch sentiment analysis for the given feedback ID
    this.feedbackService.getSentimentByFeedbackId(this.feedback().id).subscribe({
      next: (result) => {
        this.sentiment = result; // Assign sentiment result
        console.log('Sentiment Analysis:', this.sentiment);
        this.prepareMeterGroupValues(); // Prepare MeterGroup values after fetching sentiment
      },
      error: (err) => {
        console.error('Error fetching sentiment analysis:', err);
      },
    });
  }

  private loadUserDetails(): void {
    // Fetch user details using the FromUserId
    this.userAppService.getUserappById(this.feedback().fromUserId).subscribe({
      next: (result) => {
        this.userApp = result;
        if (this.userApp?.photoUrl) {
          this.photoUrl = this.userApp.photoUrl;
        }
      },
      error: (err) => {
        console.error('Error fetching user details:', err);
      }
    });
  }

  private prepareMeterGroupValues(): void {
    if (this.sentiment) {
      this.value = [
        {
          label: 'Positive',
          value: this.sentiment.positive * 100, // Convert to percentage
          color: '#4CAF50', // Green for positive sentiment
          icon: 'pi pi-smile' // Smiley face icon
        },
        {
          label: 'Neutral',
          value: this.sentiment.neutral * 100, // Convert to percentage
          color: '#FFC107', // Yellow for neutral sentiment
          icon: 'pi pi-meh' // Neutral face icon
        },
        {
          label: 'Negative',
          value: this.sentiment.negative * 100, // Convert to percentage
          color: '#F44336', // Red for negative sentiment
          icon: 'pi pi-frown' // Sad face icon
        }
      ];
    }
  }
}
