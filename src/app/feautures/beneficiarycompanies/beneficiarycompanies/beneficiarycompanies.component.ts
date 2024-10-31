import { Component, OnInit } from '@angular/core';
import { BeneficiaryCompany } from '../../../_models/beneficiarycompany';
import { BeneficiarycompanyService } from '../../../_services/beneficiarycompanies.service';

@Component({
  selector: 'app-beneficiarycompanies',
  standalone: true,
  imports:  [],
  templateUrl: './beneficiarycompanies.component.html',
  styleUrl: './beneficiarycompanies.component.css'
})
export class BeneficiarycompaniesComponent implements OnInit {
  beneficiarycompanies: BeneficiaryCompany[] = [];

  constructor(private beneficiarycompaniesService: BeneficiarycompanyService) { }

  ngOnInit() : void {
    this.loadBeneficiaryCompanies();
  }

  loadBeneficiaryCompanies() {
    this.beneficiarycompaniesService.getBeneficiaryCompanies().subscribe(beneficiarycompanies => {
      this.beneficiarycompanies = beneficiarycompanies;
    })
  }

}
