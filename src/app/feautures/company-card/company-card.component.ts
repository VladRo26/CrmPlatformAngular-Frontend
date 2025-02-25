import { Component, Input } from '@angular/core';
import { BeneficiaryCompany } from '../../_models/beneficiarycompany';
import { SoftwareCompany } from '../../_models/softwarecompany';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { NgModule } from '@angular/core';
import { NgIf } from '@angular/common';
import { HasRoleDirective } from '../../_directives/has-role.directive';
import { RouterLink } from '@angular/router';

type Company = BeneficiaryCompany | SoftwareCompany;


@Component({
  selector: 'app-company-card',
  standalone: true,
  imports: [CommonModule, MatCardModule,NgIf,HasRoleDirective,RouterLink],
  templateUrl: './company-card.component.html',
  styleUrl: './company-card.component.css'
})
export class CompanyCardComponent {
  @Input() company!: BeneficiaryCompany | SoftwareCompany;

  isBeneficiary(company: Company): company is BeneficiaryCompany {
    return (company as BeneficiaryCompany).activityDomain !== undefined;
  }

}
