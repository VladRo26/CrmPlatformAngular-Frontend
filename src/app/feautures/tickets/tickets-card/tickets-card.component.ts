import { Component, inject, Input, input } from '@angular/core';
import { Ticket } from '../../../_models/ticket';
import { BeneficiaryCompany } from '../../../_models/beneficiarycompany';
import { OnInit } from '@angular/core';
import { BeneficiarycompanyService } from '../../../_services/beneficiarycompanies.service';
import {MatCardModule} from '@angular/material/card';
import { TicketService } from '../../../_services/ticket.service';
import { RouterLink } from '@angular/router';
import { NgIf } from '@angular/common';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { SoftwarecompanyService } from '../../../_services/softwarecompanies.service';
import { UserappService } from '../../../_services/userapp.service';
import { AccountService } from '../../../_services/account.service';
import { userApp } from '../../../_models/userapp';
import { SoftwareCompany } from '../../../_models/softwarecompany';
import { ChangeDetectorRef } from '@angular/core';


@Component({
  selector: 'app-tickets-card',
  standalone: true,
  imports: [MatCardModule,RouterLink,NgIf,ProgressSpinnerModule],
  templateUrl: './tickets-card.component.html',
  styleUrl: './tickets-card.component.css'
})
export class TicketsCardComponent implements OnInit {

  beneficiaryCompanyService = inject(BeneficiarycompanyService);
  softwareCompanyService = inject(SoftwarecompanyService);
  ticketService = inject(TicketService);
  userappService = inject(UserappService);
  accountService = inject(AccountService);
  private cdr = inject(ChangeDetectorRef);

  @Input() ticket!: Ticket;

  company?: BeneficiaryCompany;
  summary?: string;
  isLoadingSummary: boolean = true; 
  userType = this.accountService.currentUser()?.userType;
  beneficiaryCompany: BeneficiaryCompany | null = null;
  softwareCompany: SoftwareCompany | null = null;
  creatorUser?: userApp | null;
  handlerUser?: userApp | null;

  companyPhotoUrl: string = '/company.png';
  companyName: string = 'No Company Assigned';
  userPhotoUrl: string = '/default-user.png';




  ngOnInit(): void {
    this.loadCompany();
    this.loadUserData();
    this.generateSummary();
  }

  loadCompany(): void {
    if (this.userType === 'SoftwareCompanyUser' && this.ticket.creatorId) {
      this.loadBeneficiaryCompany(this.ticket.creatorId);
    } else if (this.userType === 'BeneficiaryCompanyUser' && this.ticket.handlerId) {
      this.loadSoftwareCompany(this.ticket.handlerId ?? 0);
    }
  }

  /** Load Beneficiary Company */
  loadBeneficiaryCompany(userId: number): void {
    this.beneficiaryCompanyService.getBeneficiaryCompanyByUserId(userId).subscribe({
      next: (company: BeneficiaryCompany) => {
        console.log('Beneficiary Company API Response:', company);
        this.beneficiaryCompany = company;
        this.companyPhotoUrl = company.photoUrl || '/company.png';
        this.companyName = company.name || 'No Company Assigned';
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching Beneficiary Company:', err);
        this.companyPhotoUrl = '/company.png';
        this.companyName = 'No Company Assigned';
        this.cdr.detectChanges();
      }
    });
  }

  /** Load Software Company */
  loadSoftwareCompany(userId: number): void {
    this.softwareCompanyService.getSoftwareCompanyByUserId(userId).subscribe({
      next: (company: SoftwareCompany) => {
        console.log('Software Company API Response:', company);
        this.softwareCompany = company;
        this.companyPhotoUrl = company.photoUrl || '/company.png';
        this.companyName = company.name || 'No Company Assigned';
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error fetching Software Company:', err);
        this.companyPhotoUrl = '/company.png';
        this.companyName = 'No Company Assigned';
        this.cdr.detectChanges();
      }
    });
  }

  loadUserData(): void {
    if (this.ticket.creatorId) {
      this.loadUser(this.ticket.creatorId, 'creator');
    }
    if (this.ticket.handlerId) {
      this.loadUser(this.ticket.handlerId ?? 0, 'handler');
    }
  }

  loadUser(userId: number, role: 'creator' | 'handler'): void {
    this.userappService.getUserappById(userId).subscribe({
      next: (user: userApp | null) => {
        if (user) { // Ensure the response is not null
          if (role === 'creator') {
            this.creatorUser = user;
          } else {
            this.handlerUser = user;
          }
        } else {
          console.warn(`No user found for ${role} with ID: ${userId}`);
        }
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error(`Error fetching ${role} user details:`, err);
      },
    });
  }
  

  getUserPhoto(): string {
    return this.userType === 'BeneficiaryCompanyUser'
      ? this.handlerUser?.photoUrl || '/user.png'
      : this.creatorUser?.photoUrl || '/user.png';
  }
  


  generateSummary(): void {
    if (!this.ticket.id) {
      console.error('Ticket ID is missing.');
      return;
    }

    this.isLoadingSummary = true; // Set loading state to true

    this.ticketService.generateSummary(this.ticket.id).subscribe({
      next: (response) => {
        this.summary = response.summary;
        this.isLoadingSummary = false; // Set loading state to false
        console.log('Generated Summary:', this.summary);
      },
      error: (err) => {
        console.error('Error generating summary:', err);
        this.isLoadingSummary = false; // Set loading state to false even on error
      },
    });
  }
}
