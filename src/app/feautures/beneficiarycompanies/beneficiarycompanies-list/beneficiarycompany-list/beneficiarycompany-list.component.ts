import { Component, OnInit } from '@angular/core';
import { BeneficiarycompanyService } from '../../../../_services/beneficiarycompanies.service';
import { ChipModule } from 'primeng/chip';
import { CarouselModule } from 'primeng/carousel';
import { BeneficiaryCompany } from '../../../../_models/beneficiarycompany';

@Component({
  selector: 'app-beneficiarycompany-list',
  standalone: true,
  imports: [ChipModule,CarouselModule],
  templateUrl: './beneficiarycompany-list.component.html',
  styleUrl: './beneficiarycompany-list.component.css'
})
export class BeneficiarycompanyListComponent implements OnInit {
  beneficiarycompanies: BeneficiaryCompany[] = [];

  constructor(private beneficiarycompanyService: BeneficiarycompanyService) {}

  ngOnInit(): void {
    this.loadBeneficiarycompanies();
  }

  loadBeneficiarycompanies() {
    this.beneficiarycompanyService.getBeneficiaryCompanies().subscribe({
      next: (beneficiarycompanies) => (this.beneficiarycompanies = beneficiarycompanies),
    });
  }

}
