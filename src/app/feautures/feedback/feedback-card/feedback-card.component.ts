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
    // Convert to percentage and round
    const positive = Math.round(this.sentiment.positive * 100);
    const neutral = Math.round(this.sentiment.neutral * 100);
    const negative = Math.round(this.sentiment.negative * 100);

    let total = positive + neutral + negative;

    // Adjust to ensure the total is exactly 100%
    if (total !== 100) {
      const diff = 100 - total;

      // Find the max and adjust it
      const maxVal = Math.max(positive, neutral, negative);
      if (maxVal === positive) {
        this.value = [
          {
            label: 'Positive',
            value: positive + diff,
            color: '#4CAF50',
            icon: 'pi pi-smile'
          },
          {
            label: 'Neutral',
            value: neutral,
            color: '#FFC107',
            icon: 'pi pi-meh'
          },
          {
            label: 'Negative',
            value: negative,
            color: '#F44336',
            icon: 'pi pi-frown'
          }
        ];
      } else if (maxVal === neutral) {
        this.value = [
          {
            label: 'Positive',
            value: positive,
            color: '#4CAF50',
            icon: 'pi pi-smile'
          },
          {
            label: 'Neutral',
            value: neutral + diff,
            color: '#FFC107',
            icon: 'pi pi-meh'
          },
          {
            label: 'Negative',
            value: negative,
            color: '#F44336',
            icon: 'pi pi-frown'
          }
        ];
      } else {
        this.value = [
          {
            label: 'Positive',
            value: positive,
            color: '#4CAF50',
            icon: 'pi pi-smile'
          },
          {
            label: 'Neutral',
            value: neutral,
            color: '#FFC107',
            icon: 'pi pi-meh'
          },
          {
            label: 'Negative',
            value: negative + diff,
            color: '#F44336',
            icon: 'pi pi-frown'
          }
        ];
      }
    } else {
      // Already sums to 100, use as-is
      this.value = [
        {
          label: 'Positive',
          value: positive,
          color: '#4CAF50',
          icon: 'pi pi-smile'
        },
        {
          label: 'Neutral',
          value: neutral,
          color: '#FFC107',
          icon: 'pi pi-meh'
        },
        {
          label: 'Negative',
          value: negative,
          color: '#F44336',
          icon: 'pi pi-frown'
        }
      ];
    }
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
