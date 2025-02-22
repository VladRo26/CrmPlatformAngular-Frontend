import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ContractService } from '../../../_services/contract.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Contract } from '../../../_models/contract';
import { NgIf } from '@angular/common';
import { InputSwitchModule } from 'primeng/inputswitch';
import { KnobModule } from 'primeng/knob';
import { BeneficiarycompanyService } from '../../../_services/beneficiarycompanies.service';
import { SoftwarecompanyService } from '../../../_services/softwarecompanies.service';
import { BeneficiaryCompany } from '../../../_models/beneficiarycompany';
import { SoftwareCompany } from '../../../_models/softwarecompany';
import {MatFormFieldModule} from '@angular/material/form-field';
import { NgFor } from '@angular/common';
import { MatOptionModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import {MatInputModule} from '@angular/material/input';
import {MatIconModule} from '@angular/material/icon';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button'; // Add this import
import {provideNativeDateAdapter} from '@angular/material/core';





@Component({
  selector: 'app-create-contracts',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatOptionModule,
    CommonModule,
    MatInputModule,
    MatButtonModule,
    NgIf
    ,KnobModule,
    InputSwitchModule,
    NgFor,
    FormsModule,
    MatIconModule,
    MatDatepickerModule,
    MatSelectModule],
  templateUrl: './create-contracts.component.html',
  styleUrl: './create-contracts.component.css'
})
export class CreateContractsComponent {
  contractForm: FormGroup = new FormGroup({});
  beneficiaryCompanies: BeneficiaryCompany[] = [];
  softwareCompanies: SoftwareCompany[] = [];
  isSubmitting: boolean = false; // Prevents duplicate submissions


  constructor(
    private contractService: ContractService,
    private beneficiaryCompanyService: BeneficiarycompanyService,
    private softwareCompanyService: SoftwarecompanyService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.initializeForm();
    this.loadCompanyOptions();
  }

  dateRangeValidator(control: AbstractControl): ValidationErrors | null {
    const start = control.get('startDate')?.value;
    const finish = control.get('estimatedFinishDate')?.value;
    if (start && finish && new Date(finish) <= new Date(start)) {
      return { dateRange: true };
    }
    return null;
  }
  initializeForm() {
    this.contractForm = new FormGroup({
      projectName: new FormControl('', Validators.required),
      startDate: new FormControl(null, Validators.required),  // Use null here
      budget: new FormControl('', [
        Validators.required,
        Validators.pattern("^[0-9]+(\\.[0-9]{1,2})?$")
      ]),
      estimatedFinishDate: new FormControl(null, Validators.required), // Use null here
      offersSupport: new FormControl(false, Validators.required),
      status: new FormControl(50, Validators.required),
      description: new FormControl(''),
      beneficiaryCompanyName: new FormControl('', Validators.required),
      softwareCompanyName: new FormControl('', Validators.required)
    }, { validators: this.dateRangeValidator });
  }
  

  register() {
    if (this.contractForm.invalid) {
      console.log('Form errors:', this.contractForm.errors);
      Object.keys(this.contractForm.controls).forEach(key => {
        console.log(`${key} errors:`, this.contractForm.get(key)?.errors);
      });
      this.contractForm.markAllAsTouched();
      return;
    }

    if (this.isSubmitting) {
      return; // Prevent duplicate submissions
    }
    this.isSubmitting = true;

    const formValue = this.contractForm.value;

    // Helper function to format a Date into 'yyyy-MM-dd'
    const formatDate = (date: Date): string => {
      const d = new Date(date);
      const year = d.getFullYear();
      let month = (d.getMonth() + 1).toString();
      let day = d.getDate().toString();
      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;
      return `${year}-${month}-${day}`;
    };

    const formData = new FormData();
    formData.append('projectName', formValue.projectName);
    formData.append('startDate', formatDate(formValue.startDate));
    formData.append('budget', formValue.budget);
    formData.append('estimatedFinishDate', formatDate(formValue.estimatedFinishDate));
    formData.append('offersSupport', formValue.offersSupport);
    formData.append('status', formValue.status);
    formData.append('description', formValue.description);
    formData.append('beneficiaryCompanyName', formValue.beneficiaryCompanyName);
    formData.append('softwareCompanyName', formValue.softwareCompanyName);

    this.contractService.createContract(formData).subscribe({
      next: (response: Contract) => {
        this.toastr.success('Contract created successfully');
        this.router.navigateByUrl('/contracts');
        this.isSubmitting = false;
      },
      error: (error: any) => {
        this.toastr.error('Failed to create contract');
        console.error(error);
        this.isSubmitting = false;
      }
    });
  }

  
  

  loadCompanyOptions() {
    this.beneficiaryCompanyService.getBeneficiaryCompanies().subscribe({
      next: (companies) => {
        this.beneficiaryCompanies = companies;
      },
      error: (err) => console.error('Error loading beneficiary companies:', err)
    });

    this.softwareCompanyService.getSoftwareCompanies().subscribe({
      next: (companies) => {
        this.softwareCompanies = companies;
      },
      error: (err) => console.error('Error loading software companies:', err)
    });
  }

}
