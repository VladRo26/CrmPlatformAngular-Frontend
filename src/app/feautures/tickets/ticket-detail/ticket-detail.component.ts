import { Component, inject, OnInit } from '@angular/core';
import { TicketService } from '../../../_services/ticket.service';
import { ActivatedRoute } from '@angular/router';
import { Ticket } from '../../../_models/ticket';
import { TicketStatusHistory } from '../../../_models/ticketstatushistory';
import {MatCardModule} from '@angular/material/card';
import {MatTableModule} from '@angular/material/table';
import { NgIf } from '@angular/common';
import {NgxCountriesDropdownModule} from 'ngx-countries-dropdown';
import { MatButton } from '@angular/material/button';
import { Button } from 'primeng/button';
import { DatePipe } from '@angular/common';
import { NgFor } from '@angular/common';
import { TimelineModule } from 'primeng/timeline';
import { CardModule } from 'primeng/card';
import { ScrollPanelModule } from 'primeng/scrollpanel';


@Component({
  selector: 'app-ticket-detail',
  standalone: true,
  imports: [MatCardModule,MatTableModule,NgIf,NgFor,
     NgxCountriesDropdownModule,MatButton,TimelineModule,
     Button,DatePipe,CardModule,ScrollPanelModule],
  templateUrl: './ticket-detail.component.html',
  styleUrl: './ticket-detail.component.css'
})
export class TicketDetailComponent implements OnInit {
  private ticketService = inject(TicketService);
  private route = inject(ActivatedRoute);
  selectedLanguageName: string | null = null;
  ticketDescription: string | null = null; // Holds the displayed ticket description
  isLoadingPage: boolean = true; // Page loading state
  showCountryList: boolean = false; // Show country list after page load



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

  displayedColumns: string[] = ['status', 'updatedByUserId', 'ticketUserRole', 'message'];


  handleCountryChange(country: any) {
    if (country?.language) {
      this.selectedLanguageName = country.language.name;
      // Save selected language to localStorage
      localStorage.setItem('selectedLanguage', this.selectedLanguageName ?? 'English');
    } else {
      this.selectedLanguageName = null;
      localStorage.removeItem('selectedLanguage'); // Clear language from localStorage if none is selected
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


  ngOnInit(): void {
    this.loadSelectedLanguage(); // Load language from localStorage on init
    this.loadCountryListAfterDelay();
    this.loadTicketDetails();
  }

  loadCountryListAfterDelay() {
    setTimeout(() => {
      this.showCountryList = true; // Display the country list after the delay
    }, 2000); // Adjust the delay as needed
  }
  


  loadTicketDetails() {
    const ticketId = Number(this.route.snapshot.paramMap.get('id'));
    if (ticketId) {
      this.ticketService.getTicketById(ticketId).subscribe({
        next: (ticket) => {
          this.ticket = ticket;
          // Only set ticketDescription from the database if no translation exists in localStorage
          if (!localStorage.getItem('translatedDescription')) {
            this.ticketDescription = ticket.description;
          }
        },
        error: (err) => console.error('Failed to load ticket details', err),
      });

      // Fetch the ticket history
      this.ticketService.getTicketHistoryById(ticketId).subscribe({
        next: (history) => {
          this.ticketHistory = history;
          this.transformHistoryToTimeline(); // Transform history into timeline events
        },
        error: (err) => console.error('Failed to load ticket history', err),
      });
    }
  }

  translateTicketDescription() {
    if (!this.ticket?.id || !this.selectedLanguageName) {
      console.error('Ticket ID or target language is missing.');
      return;
    }

    this.ticketService
      .translateDescription(this.ticket.id, 'English', this.selectedLanguageName)
      .subscribe({
        next: (response) => {
          if (response.translation) {
            this.ticketDescription = response.translation; // Update ticket description
            // Save the translated description to localStorage
            localStorage.setItem('translatedDescription', response.translation);
          }
        },
        error: (err) => console.error('Failed to translate description', err),
      });
    }

    transformHistoryToTimeline(): void {
      this.events = this.ticketHistory.map((history) => {
        // Determine icon and color based on role
        let icon = 'pi pi-user';
        let color = '#2196F3'; // Default color
    
        if (history.ticketUserRole.toLowerCase() === 'handler') {
          icon = 'pi pi-briefcase'; // Icon for handlers
          color = '#4CAF50'; // Green for handlers
        } else if (history.ticketUserRole.toLowerCase() === 'creator') {
          icon = 'pi pi-pencil'; // Icon for creators
          color = '#FF9800'; // Orange for creators
        }
    
        return {
          status: history.status,
          date: new Date(history.updatedAt).toLocaleString(),
          role: history.ticketUserRole,
          username: history.updatedByUsername, // Add username
          message: history.message || 'No additional details provided.',
          icon,
          color,
        };
      });
    }
    
    
}
