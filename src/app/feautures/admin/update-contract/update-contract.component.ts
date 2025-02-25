import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Contract } from '../../../_models/contract';
import { ContractService } from '../../../_services/contract.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatIconModule} from '@angular/material/icon';
import { KnobModule } from 'primeng/knob';
import { NgIf } from '@angular/common';
import { provideNativeDateAdapter } from '@angular/material/core';
import {MatInputModule} from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { InputSwitchModule } from 'primeng/inputswitch';


@Component({
  selector: 'app-update-contract',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    NgIf
    ,KnobModule,
    FormsModule,
    MatIconModule,
    MatInputModule,
    MatOptionModule,
    InputSwitchModule,
    MatDatepickerModule],
  templateUrl: './update-contract.component.html',
  styleUrl: './update-contract.component.css'
})
export class UpdateContractComponent implements OnInit {
  
  updateForm: FormGroup = new FormGroup({});
  contractId: number = 0;
  isSubmitting: boolean = false;
  contract: Contract | null = null;

  constructor(
    private contractService: ContractService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // Get contract ID from route parameters (assumed parameter name is 'id')
    this.contractId = Number(this.route.snapshot.paramMap.get('id'));
    this.initializeForm();
    this.loadContract();
  }

  dateRangeValidator(control: AbstractControl): ValidationErrors | null {
    const start = control.get('startDate')?.value;
    const finish = control.get('estimatedFinishDate')?.value;
    if (start && finish && new Date(finish) <= new Date(start)) {
      return { dateRange: true };
    }
    return null;
  }

  // Build the reactive form manually without using FormBuilder
  initializeForm(): void {
    this.updateForm = new FormGroup({
      projectName: new FormControl('', Validators.required),
      startDate: new FormControl(null, Validators.required),
      budget: new FormControl('', [
        Validators.required,
        Validators.pattern("^[0-9]+(\\.[0-9]{1,2})?$")
      ]),
      estimatedFinishDate: new FormControl(null, Validators.required),
      offersSupport: new FormControl(false, Validators.required),
      status: new FormControl(50, Validators.required),
      description: new FormControl('')
    }, { validators: this.dateRangeValidator });
  }

  loadContract(): void {
    this.contractService.getContractById(this.contractId).subscribe({
      next: (contract: Contract) => {
        this.contract = contract;
        this.updateForm.patchValue({
          projectName: contract.projectName,
          // Convert date strings to Date objects for the date pickers
          startDate: new Date(contract.startDate),
          budget: contract.budget,
          estimatedFinishDate: new Date(contract.estimatedFinishDate),
          offersSupport: contract.offersSupport,
          status: contract.status,
          description: contract.description
        });
      },
      error: (error) => {
        this.toastr.error('Failed to load contract details');
        console.error(error);
      }
    });
  }

  formatDate(date: Date): string {
    const d = new Date(date);
    const year = d.getFullYear();
    let month = (d.getMonth() + 1).toString();
    let day = d.getDate().toString();
    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;
    return `${year}-${month}-${day}`;
  }

  onSubmit(): void {
    if (this.updateForm.invalid) {
      console.log('Form errors:', this.updateForm.errors);
      Object.keys(this.updateForm.controls).forEach(key => {
        console.log(`${key} errors:`, this.updateForm.get(key)?.errors);
      });
      this.updateForm.markAllAsTouched();
      return;
    }

    if (this.isSubmitting) {
      return;
    }
    this.isSubmitting = true;

    const formValue = this.updateForm.value;
    const formData = new FormData();
    formData.append('projectName', formValue.projectName);
    formData.append('startDate', this.formatDate(formValue.startDate));
    formData.append('budget', formValue.budget);
    formData.append('estimatedFinishDate', this.formatDate(formValue.estimatedFinishDate));
    formData.append('offersSupport', formValue.offersSupport);
    formData.append('status', formValue.status);
    formData.append('description', formValue.description);

    this.contractService.updateContract(this.contractId, formData).subscribe({
      next: (updatedContract: Contract) => {
        this.toastr.success('Contract updated successfully');
        this.router.navigateByUrl('/contracts');
        this.isSubmitting = false;
      },
      error: (error: any) => {
        this.toastr.error('Failed to update contract');
        console.error(error);
        this.isSubmitting = false;
      }
    });
  }
}

