import { Component, inject, OnInit } from '@angular/core';
import { TicketService } from '../../../_services/ticket.service';
import { ActivatedRoute } from '@angular/router';
import { Ticket } from '../../../_models/ticket';
import { TicketStatusHistory } from '../../../_models/ticketstatushistory';
import {MatCardModule} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import {NgxCountriesDropdownModule} from 'ngx-countries-dropdown';
import { MatButton } from '@angular/material/button';
import { Button } from 'primeng/button';
import { DatePipe } from '@angular/common';
import { NgFor,NgIf,NgClass } from '@angular/common';
import { TimelineModule } from 'primeng/timeline';
import { CardModule } from 'primeng/card';
import { ScrollPanelModule } from 'primeng/scrollpanel';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import { DialogModule } from 'primeng/dialog';
import { CreateStatushistComponent } from '../create-statushist/create-statushist.component';
import { AccountService } from '../../../_services/account.service';
import { OverlayPanel, OverlayPanelModule } from 'primeng/overlaypanel';
import { LlmService } from '../../../_services/llm.service';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastrService } from 'ngx-toastr';
import { FormsModule } from '@angular/forms';
import { UserappService } from '../../../_services/userapp.service';
import { FeedbackService } from '../../../_services/feedback.service';
import { RatingModule } from 'primeng/rating';
import { CommonModule } from '@angular/common';
import { TooltipModule } from 'primeng/tooltip';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TicketAttachment } from '../../../_services/ticketattachment';

@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [MatCardModule,MatTableModule,NgIf,NgFor,
     NgxCountriesDropdownModule,MatButton,TimelineModule,
     Button,DatePipe,CardModule,ScrollPanelModule
     ,MatButtonToggleModule,OverlayPanelModule,NgIf,DialogModule,
     CreateStatushistComponent,ButtonModule,
     ProgressBarModule,FormsModule,NgClass,RatingModule,CommonModule
     ,TooltipModule,ProgressSpinnerModule],
  templateUrl: './ticket-detail.component.html',
  styleUrl: './ticket-detail.component.css'
})
export class TicketDetailComponent implements OnInit {
  private ticketService = inject(TicketService);
  accountService = inject(AccountService);
  private userappService = inject(UserappService);
  private llmService = inject(LlmService); // Inject the LlmService
  private toastr = inject(ToastrService);
  private route = inject(ActivatedRoute);
  feedbackService = inject(FeedbackService);
  selectedLanguageName: string | null = null;
  ticketDescription: string | null = null; // Holds the displayed ticket description
  isLoadingPage: boolean = true; // Page loading state
  isBeneficiaryUser: boolean = false;
  showCountryList: boolean = false; // Show country list after page load
  visible: boolean = false;
  translatedMessage: string | null = null; // Holds the translated message
  ticketAttachments: TicketAttachment[] = [];

  




  selectedCountryConfig = {
    displayLanguageName: true, // Show the language name of the selected country
    hideName: true,
    hideDialCode: true
  };

  countryListConfig = {
    displayLanguageName: true, // Show language names in the country list
    hideName: true,
    hideDialCode: true
  };
  events: any[] = []; // Timeline events array

  ticket?: Ticket;
  ticketHistory: TicketStatusHistory[] = [];
  ticketOriginalLanguage: string | null = null; // Original language from the ticket
  ticketOriginalLanguageCode: string | null = null; // Original language code from the ticket
  translationLanguageCode: string = 'en'; // Default translation language code (English)
  ticketCountryCode: string | null = null; // Single country code from ticket
  overlayActive: boolean = false; // Tracks whether the overlay is active
  reopenVisible: boolean = false; // Controls Reopen Dialog visibility
  reopenMessage: string = ''; // Message for reopening
  currentUserId: number = 0;
  isSoftwareCompanyUser: boolean = false;
  isEligibleForFeedback: boolean = false;
  isSubmittingFeedback: boolean = false;

  feedbackDialogVisible: boolean = false;
  feedbackContent: string = '';
  feedbackRating: number = 5; // Default rating

  displayedColumns: string[] = ['status', 'updatedByUserId', 'ticketUserRole', 'message'];

  handlerUsername: string | null = null;
  creatorUsername: string | null = null;

  overlayAttachmentsLoading = false;
selectedAttachments: TicketAttachment[] = [];

showAttachmentsOverlay(event: Event, overlay: OverlayPanel, historyId: number): void {
  this.overlayAttachmentsLoading = true;
  this.ticketService.getStatusHistoryAttachments(historyId).subscribe({
    next: (attachments) => {
      this.selectedAttachments = attachments;
      this.overlayAttachmentsLoading = false;
      overlay.toggle(event);
    },
    error: () => {
      this.overlayAttachmentsLoading = false;
      this.toastr.error('Failed to load attachments');
    }
  });
}



  private setUserRole(): void {
    const userType = this.accountService.currentUser()?.userType;
    this.isBeneficiaryUser = userType === 'BeneficiaryCompanyUser';
    this.isSoftwareCompanyUser = userType === 'SoftwareCompanyUser';
  }



  handleCountryChange(country: any) {
    if (country?.language) {
      const selectedLanguageName = country.language.name;
      const selectedLanguageCode = country.language.code; // Assuming `country.language` has a `code` property
      const selectedCountryCode = country.code;
  
      if (this.ticket) {
        // Check if the selected language is the same as the current TLanguage
        if (this.ticket.tLanguage === selectedLanguageName) {
          return;
        }
  
        // Call the API to update the ticket translation
        this.ticketService
          .updateTicketTranslation(this.ticket.id, selectedLanguageName, selectedLanguageCode, selectedCountryCode)
          .subscribe({
            next: (response) => {
              if (this.ticket) {
                this.ticket.tLanguage = selectedLanguageName;
              }
              if (this.ticket) {
                this.ticket.tLanguageCode = selectedLanguageCode;
              }
              this.ticket!.tCountryCode = selectedCountryCode;
  
              this.toastr.success(response.message, 'Success');
            },
            error: (err) => {
              console.error('Failed to update ticket translation:', err);
              this.toastr.error('Failed to update ticket translation.', 'Error');
            },
          });
      }
    } else {
      this.selectedLanguageName = null;
    }
  }

  showReopenDialog(): void {
    this.reopenVisible = true;
  }

 reopenTicket(): void {
  if (!this.ticket || !this.ticket.id) {
    this.toastr.error('Ticket ID is missing.', 'Error');
    return;
  }

  if (!this.reopenMessage.trim()) {
    this.toastr.error('Please provide a reason for reopening the ticket.');
    return;
  }

  const userRole = this.accountService.currentUser()?.userType === 'SoftwareCompanyUser' ? 'Handler' : 'Creator';

  const formData = new FormData();
  formData.append('status', 'Open');
  formData.append('message', this.reopenMessage);
  formData.append('updatedByUsername', this.accountService.currentUser()?.userName || '');
  formData.append('updatedAt', new Date().toISOString());
  formData.append('ticketUserRole', userRole);
  formData.append('seen', 'false');

  this.ticketService.addTicketStatusHistory(this.ticket.id, formData).subscribe({
    next: () => {
      this.toastr.success('Ticket reopened successfully!');
      this.reopenVisible = false;
      this.reopenMessage = '';
      this.handleStatusUpdate(); // Refresh ticket
    },
    error: (err) => {
      console.error('Error reopening ticket:', err);
      this.toastr.error('Failed to reopen the ticket.');
    },
  });
}

  getStatusClass(status: string): string {
    switch (status) {
      case 'Open':
        return 'status-open';
      case 'InProgress':
        return 'status-in-progress';
      case 'Resolved':
        return 'status-resolved';
      case 'Closed':
        return 'status-closed';
      default:
        return '';
    }
  }


  loadSelectedLanguage() {
    const savedLanguage = localStorage.getItem('selectedLanguage');
    const savedDescription = localStorage.getItem('translatedDescription');

    if (savedLanguage) {
      this.selectedLanguageName = savedLanguage; // Restore the saved language
    }
    if (savedDescription) {
      this.ticketDescription = savedDescription; // Restore the saved translated description
    }
  }

  shouldShowTranslateButton(role: string): boolean {
    const userType = this.accountService.currentUser()?.userType;
  
    if (userType === 'BeneficiaryCompanyUser' && role.toLowerCase() === 'handler') {
      return true; // Show for BeneficiaryComp usertype and handler role
    }
    
    if (userType === 'SoftwareCompanyUser' && role.toLowerCase() === 'creator') {
      return true; // Show for SoftwareComp usertype and creator role
    }
  
    return false; // Hide in all other cases
  }
  


  ngOnInit(): void {
    this.loadSelectedLanguage(); // Load language from localStorage on init
    this.loadCountryListAfterDelay();
    this.loadTicketDetails();
    this.setUserRole();
    this.loadUserDetails();


  }


  private loadUserDetails(): void {
    const username = this.accountService.currentUser()?.userName;
    if (!username) {
      this.toastr.error('User not found.', 'Error');
      return;
    }

    this.userappService.getUsersapp_username(username).subscribe({
      next: (user) => {
        this.currentUserId = user.id;
        this.isSoftwareCompanyUser = user.userType === 'SoftwareCompanyUser';
        this.loadTicketDetails();
      },
      error: (err) => {
        console.error('Failed to get user details', err);
        this.toastr.error('Failed to retrieve user details.', 'Error');
      },
    });
  }

  showFeedbackDialog(): void {
    this.feedbackDialogVisible = true;
  }

  submitFeedback(): void {
    if (!this.ticket || !this.ticket.id) {
      this.toastr.error('Ticket ID is missing.', 'Error');
      return;
    }
  
    if (!this.feedbackContent.trim()) {
      this.toastr.error('Feedback content cannot be empty.', 'Error');
      return;
    }
  
    const username = this.accountService.currentUser()?.userName || '';
  
    this.isSubmittingFeedback = true;
  
    this.feedbackService.createFeedbackForBeneficiary(
      username,
      this.ticket.id,
      this.feedbackContent,
      this.feedbackRating
    ).subscribe({
      next: () => {
        this.toastr.success('Feedback submitted successfully.', 'Success');
        this.feedbackDialogVisible = false; // ✅ Close the dialog
        this.feedbackContent = '';
        this.feedbackRating = 5;
        this.isEligibleForFeedback = false; 
      },
      error: (err) => {
        console.error('Failed to submit feedback:', err);
        this.toastr.error('Failed to submit feedback.', 'Error');
      },
      complete: () => {
        this.isSubmittingFeedback = false;
      }
    });
  }
  

 
  loadCountryListAfterDelay() {
    setTimeout(() => {
      this.showCountryList = true; // Display the country list after the delay
    }, 2000); // Adjust the delay as needed
  }

  private loadTicketDetails(): void {
  const ticketId = Number(this.route.snapshot.paramMap.get('id'));
  if (!ticketId) return;

  this.loadTicketAttachments(ticketId); // ✅ Adaugă această linie aici

  this.ticketService.getTicketById(ticketId).subscribe({
    next: (ticket) => {
      this.ticket = ticket;
      this.ticketDescription = ticket.tDescription ?? ticket.description ?? null;

      if (this.isBeneficiaryUser) {
        if (ticket.handlerId) {
          this.getUserById(ticket.handlerId, 'handler');
        } else {
          this.handlerUsername = 'Not assigned yet';
        }
      }

      if (this.isSoftwareCompanyUser) {
        this.getUserById(ticket.creatorId, 'creator');
      }

      this.checkFeedbackEligibility(ticketId);
    },
    error: (err) => {
      console.error('Failed to load ticket details', err);
      this.toastr.error('Failed to load ticket details.', 'Error');
    },
  });

  this.ticketService.getTicketHistoryById(ticketId).subscribe({
    next: (history) => {
      this.ticketHistory = history;
      this.transformHistoryToTimeline();
    },
    error: (err) => {
      console.error('Failed to load ticket history', err);
      this.toastr.error('Failed to load ticket history.', 'Error');
    },
  });
 }

  private getUserById(userId: number, role: 'handler' | 'creator'): void {
    this.userappService.getUserappById(userId).subscribe({
      next: (user) => {
        if (user) {
          if (role === 'handler') {
            this.handlerUsername = user.userName;
          } else {
            this.creatorUsername = user.userName;
          }
        }
      },
      error: (err) => {
        console.error(`Failed to fetch ${role} username:`, err);
      },
    });
  }

  private checkFeedbackEligibility(ticketId: number): void {
    this.feedbackService.checkFeedbackEligibility(this.accountService.currentUser()?.userName || '', ticketId).subscribe({
      next: (isEligible) => {
        this.isEligibleForFeedback = isEligible;
      },
      error: (err) => {
        console.error('Error checking feedback eligibility:', err);
      }
    });
  }

  private loadTicketAttachments(ticketId: number): void {
  this.ticketService.getAttachments(ticketId).subscribe({
    next: (attachments) => {
      this.ticketAttachments = attachments;
    },
    error: (err) => {
      console.error('Failed to load ticket attachments', err);
      this.toastr.error('Failed to load attachments.', 'Error');
    },
  });
}


  
  

  translateTicketDescription() {
    if (!this.ticket || !this.ticket.id || !this.ticket.tLanguage) {
      this.toastr.error('Ticket ID or target language is missing.', 'Error');
      return;
    }
  
    // Check if the target language matches the ticket's original language
    if (this.ticket.language === this.ticket.tLanguage) {
      this.ticketDescription = this.ticket.description ?? null; // Use the original description
      this.toastr.info('The selected language matches the ticket language. Showing the original description.', 'Info');
      return;
    }
  
    this.ticketService
      .translateDescription(this.ticket.id, this.ticket.language ?? 'English', this.ticket.tLanguage)
      .subscribe({
        next: (response) => {
          if (response.translation) {
            this.ticketDescription = response.translation; // Assign the translated description
  
            const updateDto = {
              id: this.ticket?.id ?? 0,
              tDescription: this.ticketDescription,
            };
  
            // Update the translated description on the server
            this.ticketService.updateTDescription(updateDto).subscribe({
              next: () => {
                if (this.ticketDescription) {
                  this.ticket!.tDescription = this.ticketDescription; // Update tdescription locally
                }
                this.toastr.success('Description translated and updated successfully.', 'Success');
              },
              error: (err) => {
                console.error('Failed to update translated description:', err);
                this.toastr.error('Translation succeeded, but updating tdescription failed.', 'Error');
              },
            });
          } else {
            this.toastr.warning('No translation was returned from the translation service.', 'Warning');
          }
        },
        error: (err) => {
          console.error('Failed to translate description:', err);
          this.toastr.error('Translation failed.', 'Error');
        },
      });
  }
  
  
 transformHistoryToTimeline(): void {
  this.events = this.ticketHistory.map((history) => {
    let icon = 'pi pi-user';
    let color = 'var(--default-color)';

    if (history.ticketUserRole.toLowerCase() === 'handler') {
      icon = 'pi pi-briefcase';
      color = 'var(--role-handler)';
    } else if (history.ticketUserRole.toLowerCase() === 'creator') {
      icon = 'pi pi-pencil';
      color = 'var(--role-creator)';
    }

    return {
      id: history.id, 
      status: history.status,
      date: new Date(history.updatedAt).toLocaleString(),
      role: history.ticketUserRole,
      username: history.updatedByUsername,
      message: history.message || 'No additional details provided.',
      icon,
      color,
      attachments: []
    };
  });
}

  

    showDialog(): void {
      this.visible = true;
    }

    handleDialogClose(): void {
      this.visible = false;
    }
  
    handleStatusUpdate(): void {
      this.visible = false; // Close dialog
      this.loadTicketDetails(); // Refresh ticket details including the updated status
      this.ticketService.getTicketHistoryById(this.ticket?.id!).subscribe({
        next: (history) => {
          this.ticketHistory = history;
          this.transformHistoryToTimeline();
        },
        error: (err) => {
          console.error('Failed to load updated ticket history', err);
          this.toastr.error('Failed to refresh ticket history.', 'Error');
        },
      });
    }
    
    
    showOverlay(message: string, event: Event, overlay: OverlayPanel): void {
      if (!this.selectedLanguageName || !this.ticket?.language) {
        console.error('Selected language or original language is missing.');
        console.log('Selected language:', this.selectedLanguageName);
        this.translatedMessage = 'Language selection is missing. Please select a language.';
        overlay.toggle(event);
        return;
      }
    
      this.translatedMessage = null; // Clear previous translations
      this.selectedLanguageName = this.ticket.tLanguage ?? this.ticket.language; // Set the selected language
      this.overlayActive = true; // Set the overlay active state
      overlay.toggle(event); // Open the overlay
    
      this.llmService
        .translateText(message, this.ticket?.language, this.selectedLanguageName)
        .subscribe({
          next: (response) => {
            this.translatedMessage = response.translation || 'Translation unavailable.';
            this.overlayActive = false; // Reset the overlay active state
          },
          error: (err) => {
            console.error('Translation failed:', err);
            this.translatedMessage = 'Error translating message.';
            this.overlayActive = false; // Reset the overlay active state
          },
        });
    }

    getStatusColor(status: string): string {
      const rootStyles = getComputedStyle(document.documentElement);
      switch (status.toLowerCase()) {
        case 'open': return rootStyles.getPropertyValue('--status-open');
        case 'inprogress': return rootStyles.getPropertyValue('--status-inprogress');
        case 'resolved': return rootStyles.getPropertyValue('--status-resolved');
        case 'closed': return rootStyles.getPropertyValue('--status-closed');
        default: return '#000000'; 
      }
    }
    
    getPriorityColor(priority: string): string {
      const rootStyles = getComputedStyle(document.documentElement);
      switch (priority.toLowerCase()) {
        case 'low': return rootStyles.getPropertyValue('--priority-low');
        case 'medium': return rootStyles.getPropertyValue('--priority-medium');
        case 'high': return rootStyles.getPropertyValue('--priority-high');
        default: return '#000000'; 
      }
    }
    
    
}
