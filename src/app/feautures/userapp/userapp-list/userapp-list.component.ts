import { Component, inject, OnInit } from '@angular/core';
import { UserappService } from '../../../_services/userapp.service';
import { UserappCardComponent } from '../userapp-card/userapp-card.component';
import { PageChangedEvent, PaginationModule } from 'ngx-bootstrap/pagination';
import { AccountService } from '../../../_services/account.service';
import { UserParams } from '../../../_models/userparams';
import { SoftwareCompany } from '../../../_models/softwarecompany';
import { BeneficiaryCompany } from '../../../_models/beneficiarycompany';
import { SoftwarecompanyService } from '../../../_services/softwarecompanies.service';
import { BeneficiarycompanyService } from '../../../_services/beneficiarycompanies.service';
import { NgFor} from '@angular/common';
import { FormsModule } from '@angular/forms';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatRadioModule} from '@angular/material/radio';
import { RatingModule } from 'primeng/rating';

@Component({
  selector: 'app-userapp-list',
  standalone: true,
  imports: [UserappCardComponent,PaginationModule,NgFor,
    FormsModule,MatSelectModule,MatFormFieldModule,MatInputModule,MatRadioModule,RatingModule],
  templateUrl: './userapp-list.component.html',
  styleUrl: './userapp-list.component.css'
})
export class UserappListComponent implements OnInit {
  private accountService = inject(AccountService);
  userappService = inject(UserappService);
  userParams = new UserParams();
  softwareCompanies: SoftwareCompany[] = [];
  beneficiaryCompanies: BeneficiaryCompany[] = [];
  softwareCompanyService = inject(SoftwarecompanyService);
  beneficiaryCompanyService = inject(BeneficiarycompanyService);
  allCompanies: { name: string }[] = []; // Unified company list


  ngOnInit(): void {
    if(!this.userappService.paginatedResult())
    {
      this.loadUsersapp();
    }
    this.loadAllCompanies();
  }

  private loadAllCompanies(): void {
    const software$ = this.softwareCompanyService.getSoftwareCompanies();
    const beneficiary$ = this.beneficiaryCompanyService.getBeneficiaryCompanies();

    software$.subscribe({
      next: (softwareCompanies) => {
        this.softwareCompanies = softwareCompanies;
        this.combineCompanies(); // Combine companies after fetching
      },
      error: (err) => console.error('Error loading software companies:', err),
    });

    beneficiary$.subscribe({
      next: (beneficiaryCompanies) => {
        this.beneficiaryCompanies = beneficiaryCompanies;
        this.combineCompanies(); // Combine companies after fetching
      },
      error: (err) => console.error('Error loading beneficiary companies:', err),
    });
  }

  private combineCompanies(): void {
    this.allCompanies = [
      ...this.softwareCompanies.map((sc) => ({ name: sc.name ?? 'Unknown' })),
      ...this.beneficiaryCompanies.map((bc) => ({ name: bc.name ?? 'Unknown' })),
    ];
  }


  loadUsersapp() {
    this.userappService.getUsersapp(this.userParams);
  }

  pageChanged(event: PageChangedEvent): void {
    console.log('Pagination Event:', event); // Debug the emitted event structure
    const page = typeof event === 'number' ? event : event.page; // Ensure page is a number
    if (this.userParams.pageNumber !== page) {
      this.userParams.pageNumber = page;
      this.loadUsersapp();
    }
  }
  
  
}
