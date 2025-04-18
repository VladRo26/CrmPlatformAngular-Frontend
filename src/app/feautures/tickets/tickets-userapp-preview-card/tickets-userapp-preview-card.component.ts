import { Component, OnInit, Input, inject } from '@angular/core';
import { Ticket } from '../../../_models/ticket';
import { BeneficiarycompanyService } from '../../../_services/beneficiarycompanies.service';
import { TicketService } from '../../../_services/ticket.service';
import { UserappService } from '../../../_services/userapp.service';
import { userApp } from '../../../_models/userapp';
import { Contract } from '../../../_models/contract';
import { ContractService } from '../../../_services/contract.service';
import { AccountService } from '../../../_services/account.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-tickets-userapp-preview-card',
  standalone: true,
  imports: [MatButtonModule, MatCardModule, NgIf],
  templateUrl: './tickets-userapp-preview-card.component.html',
  styleUrls: ['./tickets-userapp-preview-card.component.css']
})
export class TicketsUserPreviewCardComponent implements OnInit {
  @Input() ticket!: Ticket;

  accountService = inject(AccountService);
  userAppService = inject(UserappService);
  contractService = inject(ContractService);
  ticketService = inject(TicketService);
  beneficiaryCompanyService = inject(BeneficiarycompanyService);

  contract?: Contract;
  companyName?: string;
  companyPhotoUrl?: string;
  softwareCompanyName?: string;
  softwareCompanyPhotoUrl?: string;
  creatorUsername?: string;
  creatorPhotoUrl?: string;
  handlerUsername?: string;
  handlerPhotoUrl?: string;

  isBeneficiaryUser: boolean = false;

  ngOnInit(): void {
    const user = this.accountService.currentUser();
    if (user?.userName) {
      this.userAppService.getUsersapp_username(user.userName).subscribe({
        next: (user: userApp) => {
          this.isBeneficiaryUser = user.userType === 'BeneficiaryCompanyUser';
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
          this.creatorUsername = user?.userName ?? 'Unknown';
          this.creatorPhotoUrl = user?.photoUrl || '/user.png';
        },
        error: () => {
          this.creatorUsername = 'Unknown';
        }
      });
    }
  }

  loadHandlerUser(): void {
    if (this.ticket.handlerId) {
      this.userAppService.getUserappById(this.ticket.handlerId).subscribe({
        next: (user: userApp | null) => {
          this.handlerUsername = user?.userName ?? 'Unknown';
          this.handlerPhotoUrl = user?.photoUrl || '/user.png';
        },
        error: () => {
          this.handlerUsername = 'Unknown';
        }
      });
    } else {
      this.handlerUsername = 'Not assigned';
      this.handlerPhotoUrl = '/user.png';
    }
  }

  loadContract(): void {
    this.contractService.getContractByTicketId(this.ticket.id).subscribe({
      next: (contract: Contract) => {
        this.contract = contract;
        this.companyName = contract.beneficiaryCompanyName;
        this.companyPhotoUrl = contract.beneficiaryCompanyPhotoUrl;
        this.softwareCompanyName = contract.softwareCompanyName;
        this.softwareCompanyPhotoUrl = contract.softwareCompanyPhotoUrl;
      }
    });
  }
}
