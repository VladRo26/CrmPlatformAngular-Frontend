import { Component,inject,OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule, FormsModule, AbstractControl, ValidationErrors } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BeneficiarycompanyService} from '../../../_services/beneficiarycompanies.service';
import { Inject } from '@angular/core';
import { BeneficiaryCompany } from '../../../_models/beneficiarycompany';
import { NgIf } from '@angular/common';



@Component({
  selector: 'app-create-beneficiary',
  standalone: true,
  imports: [ReactiveFormsModule,FormsModule,NgIf],
  templateUrl: './create-beneficiary.component.html',
  styleUrl: './create-beneficiary.component.css'
})
export class CreateBeneficiaryComponent implements OnInit {
  registerForm: FormGroup = new FormGroup({});
  router = inject(Router);
  toastr = inject(ToastrService);

  constructor(
    private beneficiaryCompanyService: BeneficiarycompanyService

  ){}



  ngOnInit(): void {
    this.initializeForm();
  }

  initializeForm() {
    this.registerForm = new FormGroup({
      name: new FormControl('', Validators.required),
      shortDescription: new FormControl('', Validators.required),
      activityDomain: new FormControl('', Validators.required),
      address: new FormControl('', Validators.required),
      establishmentDate: new FormControl('', [Validators.required, this.pastDateValidator]),
      file: new FormControl(null) // Optional
    });
  }

  pastDateValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) {
      return null; // Required validator will handle empty case
    }
    const selectedDate = new Date(control.value);
    const today = new Date();
    // Remove time from today for comparison
    today.setHours(0, 0, 0, 0);
    if (selectedDate > today) {
      return { futureDate: true };
    }
    return null;
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files && input.files.length > 0) {
      const file = input.files[0];
      this.registerForm.patchValue({ file: file });
    }
  }

  removeFile(): void {
    this.registerForm.patchValue({ file: null });
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = '';
    }
  }

  register() {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }
  
    // Prepare FormData
    const formData = new FormData();
    Object.keys(this.registerForm.value).forEach((key: string) => {
      formData.append(key, this.registerForm.get(key)?.value);
    });
  
    this.beneficiaryCompanyService.register(formData).subscribe({
      next: (response: BeneficiaryCompany) => {
        this.toastr.success('Company registered successfully');
        this.router.navigateByUrl('/home'); // Navigate to home or an appropriate route
      },
      error: (error: any) => {
        this.toastr.error('Registration failed');
        console.error(error);
      }
    });
  }
  

}
