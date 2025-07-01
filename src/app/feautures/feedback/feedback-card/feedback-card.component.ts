import { ChangeDetectorRef, Component, inject, input, NgZone, ViewChild } from '@angular/core';
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
import { ButtonModule } from 'primeng/button';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { NgxCountriesDropdownModule } from 'ngx-countries-dropdown';
import { Ticket } from '../../../_models/ticket';
import { TicketService } from '../../../_services/ticket.service';
import { Observable } from 'rxjs';
import { LlmService } from '../../../_services/llm.service';
import { ProgressBarModule } from 'primeng/progressbar';

@Component({
  selector: 'app-feedback-card',
  standalone: true,
  imports: [MatCardModule,DatePipe,NgIf,PercentPipe,
    MeterGroupModule,RatingModule,FormsModule,ButtonModule,OverlayPanelModule,NgxCountriesDropdownModule,ProgressBarModule],
  templateUrl: './feedback-card.component.html',
  styleUrl: './feedback-card.component.css'
})
export class FeedbackCardComponent implements OnInit {
  feedback = input.required<Feedback>();
  sentiment: FeedbackSentiment | null = null;
  feedbackService = inject(FeedbackService);
  ticketService = inject(TicketService); // Inject TicketService
  llmService = inject(LlmService); // Inject LlmService 
  userAppService = inject(UserappService); // Inject UserappService
  changeDetector = inject(ChangeDetectorRef); // Inject ChangeDetectorRef
  ngZone = inject(NgZone); // Inject NgZone

  userApp: userApp | null = null; // User details for the feedback
  value: any[] = [];
  photoUrl: string = '/user.png'; 

  @ViewChild('translationPanel') translationPanel!: OverlayPanel;
  isTranslating: boolean = false; // Flag to control progress bar

  selectedTicket!: Ticket | null;
  translatedMessage: string | null = null;
  originalContent: string | null = null; // Stores the original content
  selectedSourceLanguage: string | null = null;
  selectedSourceLanguageCode: string | null = null;
  selectedTargetLanguage: string | null = null;
  selectedTargetLanguageCode: string | null = null;
  selectedCountyCode: string | null = null;

  selectedCountryConfig = {
    displayLanguageName: true,
    hideName: true,
    hideDialCode: true
  };

  countryListConfig = {
    displayLanguageName: true,
    hideName: true,
    hideDialCode: true
  };


  ngOnInit(): void {
    this.loadSentiment();
    this.loadUserDetails();
    this.originalContent = this.feedback().content ?? ''; // Store original content
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


  openTranslationPanel(event: Event, ticketId?: number): void {
    if (!ticketId) return;
  
    this.getTicketById(ticketId).subscribe(ticket => {
      console.log('Ticket Language:', ticket.language, 'Code:', ticket.languageCode);
  
      this.selectedTicket = ticket;
      this.selectedSourceLanguage = ticket.language ?? 'Unknown';
      this.selectedSourceLanguageCode = ticket.languageCode ?? 'en';
      this.selectedCountyCode = ticket.countryCode ?? 'US';

      this.translatedMessage = null;
      this.translationPanel.toggle(event);
    });
  }
  

  getTicketById(ticketId: number): Observable<Ticket> {
    return this.ticketService.getTicketById(ticketId);
  }

  handleCountryChange(country: any) {
    if (country?.language) {
      this.selectedTargetLanguage = country.language.name;
      this.selectedTargetLanguageCode = country.language.code;
    }
  }

  translateFeedback(): void {
    console.log("📢 Sending Translation Request...");
    console.log("🔹 Original Content:", this.feedback().content);
    console.log("🌍 Source Language:", this.selectedSourceLanguage);
    console.log("🌎 Target Language:", this.selectedTargetLanguage);
  
    if (!this.feedback().content || !this.selectedSourceLanguage || !this.selectedTargetLanguage) {
      console.error("🚨 Missing content, source language, or target language!");
      return;
    }
  
    this.isTranslating = true; // ✅ Show progress bar when clicking translate
    this.translatedMessage = null;
  
    this.llmService.translateText(
      this.feedback().content ?? '',
      this.selectedSourceLanguage,
      this.selectedTargetLanguage
    ).subscribe({
      next: response => {
        console.log("✅ Translation API Response:", response);
  
        if (response && response.translation) {
          this.translatedMessage = response.translation.trim();
        } else {
          console.warn("⚠️ API response did not contain 'translation' field.");
        }
  
        this.isTranslating = false; // ✅ Hide progress bar after translation
      },
      error: err => {
        console.error("❌ Error calling translation API:", err);
        this.isTranslating = false; // ✅ Hide progress bar even if error occurs
      }
    });
  }
}
