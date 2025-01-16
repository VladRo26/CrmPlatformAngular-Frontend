import { Component, inject, input } from '@angular/core';
import { Ticket } from '../../../_models/ticket';
import { BeneficiaryCompany } from '../../../_models/beneficiarycompany';
import { OnInit } from '@angular/core';
import { BeneficiarycompanyService } from '../../../_services/beneficiarycompanies.service';
import {MatCardModule} from '@angular/material/card';
import { TicketService } from '../../../_services/ticket.service';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-tickets-card',
  standalone: true,
  imports: [MatCardModule,RouterLink],
  templateUrl: './tickets-card.component.html',
  styleUrl: './tickets-card.component.css'
})
export class TicketsCardComponent implements OnInit {

  beneficiaryCompanyService = inject(BeneficiarycompanyService);
  ticketService = inject(TicketService);
  ticket = input.required<Ticket>();
  company?: BeneficiaryCompany;
  summary?: string;


  ngOnInit(): void {
    this.loadCompanyByUserId();
    this.generateSummary();
  }

  loadCompanyByUserId(): void {
    if (!this.ticket().creatorId) {
      console.error('Creator ID is missing in the ticket.');
      return;
    }

    this.beneficiaryCompanyService.getBeneficiaryCompanyByUserId(this.ticket().creatorId).subscribe({
      next: (data) => {
        this.company = data;
      },
      error: (err) => {
        console.error('Error fetching company details:', err);
      },
    });
  }

  generateSummary(): void {
    if (!this.ticket().id) {
      console.error('Ticket ID is missing.');
      return;
    }

    this.ticketService.generateSummary(this.ticket().id).subscribe({
      next: (response) => {
        this.summary = response.summary;
        console.log('Generated Summary:', this.summary);
      },
      error: (err) => {
        console.error('Error generating summary:', err);
      },
    });
  }



}
