import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators,ReactiveFormsModule } from '@angular/forms';
import { BeneficiaryCompany } from '../../../_models/beneficiarycompany';
import { BeneficiarycompanyService } from '../../../_services/beneficiarycompanies.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { provideNativeDateAdapter } from '@angular/material/core';
import { NgIf } from '@angular/common';
import { ImageModule } from 'primeng/image';

@Component({
  selector: 'app-update-beneficiary',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    NgIf,
    ImageModule,
    ReactiveFormsModule,
    MatCardModule
  ],
  templateUrl: './update-beneficiary.component.html',
  styleUrl: './update-beneficiary.component.css'
})
export class UpdateBeneficiaryComponent implements OnInit {

  updateForm: FormGroup = new FormGroup({});
  originalCompanyName: string = ''; // we'll store the original company name
  isSubmitting: boolean = false;
  company: BeneficiaryCompany | null = null;
  selectedFile: File | null = null;
  companyPhotoUrl: string = ''; // Store the company photo URL


  constructor(
    private beneficiaryService: BeneficiarycompanyService,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    // Get company name from route parameters (assumed parameter name is 'companyName')
    this.originalCompanyName = this.route.snapshot.paramMap.get('companyName') || '';
    this.initializeForm();
    this.loadCompany(this.originalCompanyName);
  }

  dateRangeValidator(control: AbstractControl): ValidationErrors | null {
    return null;
  }

  initializeForm(): void {
    this.updateForm = new FormGroup({
      name: new FormControl('', Validators.required),
      shortDescription: new FormControl(''),
      activityDomain: new FormControl(''),
      address: new FormControl(''),
      establishmentDate: new FormControl(null, Validators.required)
      // The file input is handled separately.
    }, { validators: this.dateRangeValidator });
  }

  loadCompany(companyName: string): void {
    this.beneficiaryService.getBeneficiaryCompanyByName(companyName).subscribe({
      next: (company: BeneficiaryCompany) => {
        this.company = company;
        this.originalCompanyName = company.name || '';
        this.companyPhotoUrl = company.photoUrl || '/company.png'; // Set photo URL
  
        this.updateForm.patchValue({
          name: company.name,
          shortDescription: company.shortDescription,
          activityDomain: company.activityDomain,
          address: company.address,
          establishmentDate: new Date(company.establishmentDate)
        });
      },
      error: (error) => {
        this.toastr.error('Failed to load company details');
        console.error(error);
      }
    });
  }

  onFileSelected(event: any): void {
    if (event.target.files && event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
  
      // Preview the new photo before uploading
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.companyPhotoUrl = e.target.result; // Update preview
      };
      if (this.selectedFile) {
        reader.readAsDataURL(this.selectedFile);
      }
    }
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
    formData.append('name', formValue.name);
    formData.append('shortDescription', formValue.shortDescription);
    formData.append('activityDomain', formValue.activityDomain);
    formData.append('address', formValue.address);
    formData.append('establishmentDate', this.formatDate(formValue.establishmentDate));
    if (this.selectedFile) {
      formData.append('file', this.selectedFile);
    }

    // Use the original company name in the URL for update.
    this.beneficiaryService.updateBeneficiaryCompany(this.originalCompanyName, formData).subscribe({
      next: (updatedCompany: BeneficiaryCompany) => {
        this.toastr.success('Company updated successfully');
        this.router.navigateByUrl('/companies');
        this.isSubmitting = false;
      },
      error: (error: any) => {
        this.toastr.error('Failed to update company');
        console.error(error);
        this.isSubmitting = false;
      }
    });
  }
}
