import { Component, inject } from '@angular/core';
import { BeneficiarycompanyService } from '../../../_services/beneficiarycompanies.service';
import { SoftwarecompanyService } from '../../../_services/softwarecompanies.service';
import { BeneficiaryCompany } from '../../../_models/beneficiarycompany';
import { SoftwareCompany } from '../../../_models/softwarecompany';
import { PaginatedResult } from '../../../_models/pagination';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { NgFor } from '@angular/common';
import { PageChangedEvent, PaginationModule } from 'ngx-bootstrap/pagination';
import { CompanyCardComponent } from '../../company-card/company-card.component';
import {MatFormFieldModule} from '@angular/material/form-field';
import { MatOptionModule } from '@angular/material/core';
import { MatIcon } from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {MatCardModule} from '@angular/material/card';


@Component({
  selector: 'app-company-list',
  standalone: true,
  imports: [FormsModule,CommonModule,NgFor,PaginationModule
    ,CompanyCardComponent,MatFormFieldModule,MatOptionModule,MatIcon,MatInputModule,MatSelectModule,MatButtonModule,MatButtonToggleModule,MatCardModule],
  templateUrl: './company-list.component.html',
  styleUrl: './company-list.component.css'
})
export class CompanyListComponent {
  private beneficiaryService = inject(BeneficiarycompanyService);
  private softwareService = inject(SoftwarecompanyService);
  
  companies: (BeneficiaryCompany | SoftwareCompany)[] = [];
  paginatedResult: PaginatedResult<(BeneficiaryCompany | SoftwareCompany)[]> | null = null;

  companyType: string = 'all'; // "beneficiary", "software", or "all"
  filter: string = '';
  orderBy: string = 'name';
  pageNumber: number = 1;
  pageSize: number = 3;
  
  ngOnInit(): void {
    this.loadCompanies();
  }
  
  loadCompanies(): void {
    if (this.companyType === 'beneficiary') {
      const params = { PageNumber: this.pageNumber, PageSize: this.pageSize, CompanyName: this.filter, OrderBy: this.orderBy };
      this.beneficiaryService.getBeneficiaryCompaniesPaged(params).subscribe({
        next: response => {
          this.companies = response.body || [];
          this.paginatedResult = {
            items: this.companies,
            pagination: JSON.parse(response.headers.get('Pagination')!)
          };
        },
        error: err => console.error(err)
      });
    } else if (this.companyType === 'software') {
      const params = { PageNumber: this.pageNumber, PageSize: this.pageSize, CompanyName: this.filter, OrderBy: this.orderBy };
      this.softwareService.getSoftwareCompaniesPaged(params).subscribe({
        next: response => {
          this.companies = response.body || [];
          this.paginatedResult = {
            items: this.companies,
            pagination: JSON.parse(response.headers.get('Pagination')!)
          };
        },
        error: err => console.error(err)
      });
    } else if (this.companyType === 'all') {
      // For "all", combine both non-paged endpoints and paginate client-side.
      // Note: This is a client-side workaround. For large datasets, consider a backend unified endpoint.
      let beneficiaryCompanies: BeneficiaryCompany[] = [];
      let softwareCompanies: SoftwareCompany[] = [];
      
      this.beneficiaryService.getBeneficiaryCompanies().subscribe({
        next: bcs => {
          beneficiaryCompanies = bcs;
          combineCompanies();
        },
        error: err => console.error(err)
      });
      this.softwareService.getSoftwareCompanies().subscribe({
        next: scs => {
          softwareCompanies = scs;
          combineCompanies();
        },
        error: err => console.error(err)
      });
      
      const combineCompanies = () => {
        if (beneficiaryCompanies && softwareCompanies) {
          let all = [...beneficiaryCompanies, ...softwareCompanies];
          // Apply filter
          if (this.filter) {
            all = all.filter(c => (c.name || '').toLowerCase().includes(this.filter.toLowerCase()));
          }
          // Order by name
          all.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
          // Client-side paging
          const startIndex = (this.pageNumber - 1) * this.pageSize;
          const pagedItems = all.slice(startIndex, startIndex + this.pageSize);
          this.companies = pagedItems;
          this.paginatedResult = {
            items: pagedItems,
            pagination: {
              currentPage: this.pageNumber,
              itemsPerPage: this.pageSize,
              totalItems: all.length,
              totalPages: Math.ceil(all.length / this.pageSize)
            }
          };
        }
      };
    }
  }
  
  resetFilters(): void {
    this.filter = '';
    this.pageNumber = 1;
    this.loadCompanies();
  }
  
  pageChanged(event: PageChangedEvent): void {
    this.pageNumber = event.page;
    this.loadCompanies();
  }
  
  trackById(index: number, company: any): any {
    return company.id || company.name;
  }

}
