import { Component, inject, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Ticket } from '../../_models/ticket';
import { BeneficiarycompanyService } from '../../_services/beneficiarycompanies.service';
import { TicketService } from '../../_services/ticket.service';
import { UserappService } from '../../_services/userapp.service';
import { userApp } from '../../_models/userapp';
import { Contract } from '../../_models/contract';
import { ContractService } from '../../_services/contract.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-tickets-userapp-card',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, NgIf],
  templateUrl: './tickets-userapp-card.component.html',
  styleUrls: ['./tickets-userapp-card.component.css']
})
export class TicketsUserappCardComponent implements OnInit {
  // Receive the ticket as an input.
  @Input() ticket!: Ticket;

  // Inject required services.
  beneficiaryCompanyService = inject(BeneficiarycompanyService);
  userAppService = inject(UserappService);
  contractService = inject(ContractService);
  ticketService = inject(TicketService);
  route = inject(ActivatedRoute);

  contract?: Contract;
  companyName?: string;              // Beneficiary Company name
  companyPhotoUrl?: string;          // Beneficiary Company logo
  softwareCompanyName?: string;      // Software Company name
  softwareCompanyPhotoUrl?: string;  // Software Company logo
  creatorUsername?: string;
  creatorPhotoUrl?: string;
  handlerUsername?: string;
  handlerPhotoUrl?: string;

  isBeneficiaryUser: boolean = false;

  ngOnInit(): void {
    const pathUsername = this.route.snapshot.paramMap.get('username');
    if (pathUsername) {
      this.userAppService.getUsersapp_username(pathUsername).subscribe({
        next: (user: userApp) => {
          if (user && user.userType === 'BeneficiaryCompanyUser') {
            this.isBeneficiaryUser = true;
          } else {
            this.isBeneficiaryUser = false;
          }
        }
      });
    } 
    
    this.loadCreatorUser();
    this.loadHandlerUser();
    this.loadContract();
  }

  loadCreatorUser(): void {
    if (this.ticket.creatorId) {
      this.userAppService.getUserappById(this.ticket.creatorId).subscribe({
        next: (user: userApp | null) => {
          if (user) {
            this.creatorUsername = user.userName;
            this.creatorPhotoUrl = user.photoUrl || '/user.png';
          } else {
            this.creatorUsername = 'Unknown';
          }
        },
        error: (err) => {
          console.error('Error fetching creator user:', err);
          this.creatorUsername = 'Unknown';
        }
      });
    }
  }

  loadHandlerUser(): void {
    if (this.ticket.handlerId) {
      this.userAppService.getUserappById(this.ticket.handlerId).subscribe({
        next: (user: userApp | null) => {
          if (user) {
            this.handlerUsername = user.userName;
            this.handlerPhotoUrl = user.photoUrl || '/user.png';
          } else {
            this.handlerUsername = 'Unknown';
          }
        },
        error: (err) => {
          console.error('Error fetching handler user:', err);
          this.handlerUsername = 'Unknown';
        }
      });
    } else {
      this.handlerUsername = 'Not assigned';
      this.handlerPhotoUrl = '/default-handler.png';
    }
  }

  loadContract(): void {
    // Retrieve the contract for this ticket using its id.
    this.contractService.getContractByTicketId(this.ticket.id).subscribe({
      next: (contract: Contract) => {
        this.contract = contract;
        // Extract both beneficiary and software company details.
        this.companyName = contract.beneficiaryCompanyName;
        this.companyPhotoUrl = contract.beneficiaryCompanyPhotoUrl;
        this.softwareCompanyName = contract.softwareCompanyName;
        this.softwareCompanyPhotoUrl = contract.softwareCompanyPhotoUrl;
      },
      error: (err) => {
        console.error('Error loading contract for ticket:', err);
      }
    });
  }
}
