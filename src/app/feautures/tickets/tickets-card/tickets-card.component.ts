import { Component, inject, input } from '@angular/core';
import { Ticket } from '../../../_models/ticket';
import { BeneficiaryCompany } from '../../../_models/beneficiarycompany';
import { OnInit } from '@angular/core';
import { BeneficiarycompanyService } from '../../../_services/beneficiarycompanies.service';
import {MatCardModule} from '@angular/material/card';



@Component({
  selector: 'app-tickets-card',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './tickets-card.component.html',
  styleUrl: './tickets-card.component.css'
})
export class TicketsCardComponent implements OnInit {

  beneficiaryCompanyService = inject(BeneficiarycompanyService);
  ticket = input.required<Ticket>();
  company?: BeneficiaryCompany;

  ngOnInit(): void {
    this.loadCompanyByUserId();
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



}
