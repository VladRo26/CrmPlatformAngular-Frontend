import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core'; // Add this import
import { MatButtonModule } from '@angular/material/button'; // Add this import
import { SoftwarecompanyService } from '../../../_services/softwarecompanies.service';
import { BeneficiarycompanyService } from '../../../_services/beneficiarycompanies.service';
import { SoftwareCompany } from '../../../_models/softwarecompany';
import { BeneficiaryCompany } from '../../../_models/beneficiarycompany';
import { CommonModule } from '@angular/common';
import { AccountService } from '../../../_services/account.service';
import { inject } from '@angular/core';
import { NgxParticlesModule } from "@tsparticles/angular";
import { MoveDirection, OutMode, Container} from "@tsparticles/engine";
//import { loadFull } from "tsparticles"; // if you are going to use `loadFull`, install the "tsparticles" package too.
import { loadSlim } from "@tsparticles/slim"; // if you are going to use `loadSlim`, install the "@tsparticles/slim" package too.
import { NgParticlesService } from "@tsparticles/angular";
import { ParticlesService } from '../../../_services/particles.services';
import { ToastrService } from 'ngx-toastr';
import { JsonPipe } from '@angular/common';
import { NgxMaterialIntlTelInputComponent } from 'ngx-material-intl-tel-input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import {MatInputModule} from '@angular/material/input';
import {provideNativeDateAdapter} from '@angular/material/core';
import { FileUpload, FileUploadEvent, FileUploadModule } from 'primeng/fileupload';
import { MessageService, PrimeNGConfig} from 'primeng/api';
import { UserappService } from '../../../_services/userapp.service';
import { Router } from '@angular/router';
import { ChangeDetectorRef } from '@angular/core';



@Component({
  selector: 'app-register',
  standalone: true,
  providers: [provideNativeDateAdapter(),MessageService],
  imports: [
    ReactiveFormsModule,
    MatButtonToggleModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule, // Ensure this is imported
    MatButtonModule, // Ensure this is imported
    CommonModule,
    NgxParticlesModule,
    JsonPipe,
    NgxMaterialIntlTelInputComponent,
    MatDatepickerModule,
    MatInputModule,
    FileUploadModule,
    FormsModule
],
changeDetection: ChangeDetectionStrategy.OnPush,


  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  id = "tsparticles";
  particlesService = inject(ParticlesService);
  particlesOptions = this.particlesService.particlesOptions;
  private toastr = inject(ToastrService);
  private userAppService = inject(UserappService);
  private router = inject(Router);
  selectedFile: File | null = null;



  registerForm: FormGroup = new FormGroup({});
  softwareCompanies: SoftwareCompany[] = [];
  beneficiaryCompanies: BeneficiaryCompany[] = [];
  accountService = inject(AccountService);
  softwareCompanyService = inject(SoftwarecompanyService);
  beneficiaryCompanyService = inject(BeneficiarycompanyService);
  ngxParticlesService = inject(NgParticlesService);
  uploadedFiles: any[] = [];
  validationErrors: string[] | undefined;

  constructor(private messageService: MessageService,private cdr: ChangeDetectorRef) {}



  ngOnInit(): void {
    this.loadSoftwareCompanies();
    this.loadBeneficiaryCompanies();
    this.particlesService.initParticles();
    this.initializeForm();
  }

  initializeForm(){
    this.registerForm = new FormGroup({
      username: new FormControl('',Validators.required),
      firstName: new FormControl(),
      lastName: new FormControl(),
      email: new FormControl('',[Validators.required, Validators.email]),
      phoneNumber: new FormControl('',[Validators.required]),
      userType: new FormControl(''),
      Company: new FormControl(''),
      password: new FormControl('',[Validators.required, Validators.minLength(4), Validators.maxLength(12)]),
      hireDate: new FormControl('',[Validators.required]),
      confirmPassword: new FormControl('',[Validators.required,this.comparePasswords('password')]),
      file: new FormControl(null), // Add file control here

    });

    this.registerForm.controls['password'].valueChanges.subscribe(() => {
      this.registerForm.controls['confirmPassword'].updateValueAndValidity();
    });

    this.registerForm.get('phoneNumber')?.valueChanges.subscribe((value) => {
      const trimmedValue = this.trimPhoneNumber(value || '');
      console.log('Original phoneNumber:', value, 'Trimmed:', trimmedValue); // Debugging log
      if (value !== trimmedValue) {
        this.registerForm.get('phoneNumber')?.setValue(trimmedValue, { emitEvent: false });
        this.registerForm.get('phoneNumber')?.updateValueAndValidity();
      }
    });
    
  }

  comparePasswords(matchTo: string): any {
    return (control: AbstractControl) => {
      return control.value == control.parent?.get(matchTo)?.value ? null : {isMatching: true};
    }
  }

 
  register() {
    const hireDate = this.getDateOnly(this.registerForm.get('hireDate')?.value);
    this.registerForm.get('hireDate')?.setValue(hireDate);
  
    const formData = new FormData();
  
    // Append all form fields except `file`
    Object.keys(this.registerForm.value).forEach((key) => {
      if (key !== 'file') {
        formData.append(key, this.registerForm.get(key)?.value);
      }
    });
  
    // Append the file separately
    const file = this.registerForm.get('file')?.value;
    if (file) {
      formData.append('file', file);
    }
  
    this.accountService.register(formData).subscribe({
      next: () => {
        this.router.navigateByUrl('/home');
        this.cancel();
      },
      error: (error) => {
        this.validationErrors = error;
      },
    });
  }
  

  
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input?.files && input.files.length > 0) {
      const file = input.files[0]; // Get the selected file
      this.registerForm.patchValue({ file }); // Bind the file to the form
    }
  }
  
  removeFile(): void {
    // Clear the file from the form
    this.registerForm.patchValue({ file: null });
  
    // Optionally reset the file input field
    const fileInput = document.querySelector('input[type="file"]') as HTMLInputElement;
    if (fileInput) {
      fileInput.value = ''; // Clear the value of the file input
    }
  }
  

  loadSoftwareCompanies(): void {
    this.softwareCompanyService.getSoftwareCompanies().subscribe(
      (companies: SoftwareCompany[]) => { // Specify the type explicitly
        this.softwareCompanies = companies;
      },
      (error: any) => { // Specify the type explicitly
        console.error('Error fetching software companies:', error);
      }
    );
  }

  loadBeneficiaryCompanies(): void {
    this.beneficiaryCompanyService.getBeneficiaryCompanies().subscribe(
      (companies: BeneficiaryCompany[]) => { // Specify the type explicitly
        this.beneficiaryCompanies = companies;
      },
      (error: any) => { // Specify the type explicitly
        console.error('Error fetching beneficiary companies:', error);
      }
    );
  }

  private getDateOnly(input: any): string {
    const date = input instanceof Date ? input : new Date(input); // Ensure it is a Date object
    if (isNaN(date.getTime())) {
      throw new Error("Invalid date provided"); // Throw an error for invalid dates
    }
    return date.toISOString().split('T')[0]; // Return date in 'YYYY-MM-DD' format
  }
  

  private trimPhoneNumber(phoneNumber: string): string {
    return phoneNumber.replace(/\s+/g, ''); // Remove all spaces
  }
  
  
  cancel(): void {
    console.log('Registration cancelled');
  }
}
