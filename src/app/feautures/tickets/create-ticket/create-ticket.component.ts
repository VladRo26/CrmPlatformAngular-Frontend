import { Component, inject } from '@angular/core';
import { AccountService } from '../../../_services/account.service';
import { TicketService } from '../../../_services/ticket.service';
import { ContractService } from '../../../_services/contract.service';
import { CreateTicket } from '../../../_models/createticket';
import { Contract } from '../../../_models/contract';
import { NgFor, NgIf } from '@angular/common';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { userApp } from '../../../_models/userapp';
import { UserappService } from '../../../_services/userapp.service';
import { CurrencyPipe } from '@angular/common';
import { TableModule } from 'primeng/table';
import { DragDropModule } from 'primeng/dragdrop';
import { CommonModule } from '@angular/common';
import {NgxCountriesDropdownModule} from 'ngx-countries-dropdown';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-create-ticket',
  standalone: true,
  imports: [CurrencyPipe, ReactiveFormsModule, NgFor, NgIf,TableModule,
    DragDropModule,CommonModule,NgxCountriesDropdownModule,MatFormFieldModule,
    MatInputModule,MatButtonModule,MatSelectModule],
  templateUrl: './create-ticket.component.html',
  styles: [
    `:host ::ng-deep {
        .drop-column {
            border: 1px solid transparent;
            transition: border-color .2s;
        
            &.p-draggable-enter {
                border-color: var(--primary-color); 
            }
        }
    
        [pDraggable] {
            cursor: move;
        }
    }`
]
})
export class CreateTicketComponent implements OnInit {
  accountService = inject(AccountService);
  ticketService = inject(TicketService);
  contractService = inject(ContractService);
  userappService = inject(UserappService);
  router = inject(Router);
  toastr = inject(ToastrService);
  contracts: Contract[] = [];
  selectedContract: Contract | null = null; // Store the dragged and dropped contract
  draggedContract: Contract | null = null; // Temporarily hold the dragged contract
  selectedFiles: File[] = [];
  acceptedTypes = '.pdf,.png,.jpeg,.jpg,.zip';
  isSubmitting = false;

onFilesSelected(event: Event): void {
  const input = event.target as HTMLInputElement;
  if (!input.files) return;

  const allowedExtensions = ['pdf', 'png', 'jpeg', 'jpg', 'zip'];
  const maxSizeMB = 10;

  Array.from(input.files).forEach(file => {
    const ext = file.name.split('.').pop()?.toLowerCase();
    const sizeMB = file.size / (1024 * 1024); // convert to MB

    if (!ext || !allowedExtensions.includes(ext)) {
      this.toastr.warning(`File type not allowed: ${file.name}`);
      return;
    }

    if (sizeMB > maxSizeMB) {
      this.toastr.error(`File too large: ${file.name} exceeds ${maxSizeMB}MB`);
      return;
    }

    // Avoid duplicates
    if (!this.selectedFiles.find(f => f.name === file.name && f.size === file.size)) {
      this.selectedFiles.push(file);
    }
  });

  input.value = ''; // Reset file input
}


  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);

    const fileInput = document.getElementById('fileUpload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }



  createTicketForm: FormGroup = new FormGroup({});
  currentUserName: string = '';
  currentUser: userApp | null = null;

  statuses = [
    { label: 'Open', value: 'Open' },
    { label: 'In Progress', value: 'InProgress' },
    { label: 'Resolved', value: 'Resolved' },
    { label: 'Closed', value: 'Closed' },
  ];
  priorities = [
    { label: 'Low', value: 'Low' },
    { label: 'Medium', value: 'Medium' },
    { label: 'High', value: 'High' },
    { label: 'Critical', value: 'Critical' },
  ];
  types = [
    { label: 'Bug', value: 'Bug' },
    { label: 'Task', value: 'Task' },
    { label: 'Feature', value: 'Feature' },
  ]

  selectedCountryConfig = {
    displayLanguageName: true,
    hideName: true,
    hideDialCode: true,
  };

  countryListConfig = {
    displayLanguageName: true,
    hideName: true,
    hideDialCode: true,
  };


  selectedLanguageName: string = 'English'; 
  selectedCountryCode: string = ''; 
  selectedLanguageCode: string = ''; 

  showCountryList: boolean = true; // Show the country list dropdown

  ngOnInit(): void {
    this.currentUserName = this.accountService.currentUser()?.userName ?? '';
    this.loadUserDetails();
    this.initForm();
    console.log(this.createTicketForm.value);
console.log(this.createTicketForm.status);

  }

  initForm(): void {
    this.createTicketForm = new FormGroup({
      title: new FormControl('', [Validators.required, Validators.minLength(5)]),
      description: new FormControl('', [Validators.required, Validators.minLength(10)]),
      priority: new FormControl('Medium', Validators.required),
      type: new FormControl('Bug', Validators.required),
      status: new FormControl('Open', Validators.required),
      contractId: new FormControl('', Validators.required),
      creatorId: new FormControl({ value: '', disabled: true }), // Disabled as it’s dynamic
      language: new FormControl(this.selectedLanguageName, Validators.required), // Bind language
      countryCode: new FormControl(this.selectedCountryCode, Validators.required), // Ensure it's not disabled
      languageCode: new FormControl(this.selectedLanguageCode, Validators.required), // Ensure it's not disabled

    });
  }

  loadUserDetails(): void {
    if (!this.currentUserName) {
      this.toastr.error('Username is required.');
      return;
    }

    this.userappService.getUsersapp_username(this.currentUserName).subscribe({
      next: (user) => {
        this.currentUser = user;
        this.fetchContractsByUserCompany(user.companyName);
      },
      error: (err) => {
        console.error('Error fetching user details:', err);
        this.toastr.error('Failed to fetch user details.');
      },
    });
  }

  fetchContractsByUserCompany(companyName: string): void {
    if (!companyName) {
      this.toastr.error('Company name is required to fetch contracts.');
      return;
    }

    this.contractService.getContractsByBeneficiaryCompanyName(companyName).subscribe({
      next: (data) => {
        this.contracts = data;
        if (this.contracts.length === 0) {
          this.toastr.warning(`No contracts found for company: ${companyName}`);
        }
      },
      error: (err) => {
        console.error('Error fetching contracts:', err);
        this.toastr.error('Failed to fetch contracts.');
      },
    });
  }

  submitTicket(): void {
  if (this.createTicketForm.invalid || !this.selectedContract || !this.currentUser) {
    this.createTicketForm.markAllAsTouched();
    this.toastr.error('Please fill all required fields and select a contract.');
    return;
  }

  this.isSubmitting = true; // ✅ Disable the button

  const formData = new FormData();
  const values = this.createTicketForm.getRawValue();

  formData.append('title', values.title ?? '');
  formData.append('description', values.description ?? '');
  formData.append('status', values.status ?? 'Open');
  formData.append('priority', values.priority ?? '');
  formData.append('type', values.type ?? '');
  formData.append('contractId', this.selectedContract.id.toString());
  formData.append('creatorId', this.currentUser.id.toString());
  formData.append('language', values.language ?? '');
  formData.append('languageCode', values.languageCode ?? '');
  formData.append('countryCode', values.countryCode ?? '');

  this.selectedFiles.forEach(file => {
    formData.append('attachments', file);
  });

  this.ticketService.createTicket(formData).subscribe({
    next: () => {
      this.toastr.success('Ticket created successfully!');
      this.resetForm();
      this.router.navigate(['/home']);
      this.isSubmitting = false; // ✅ Re-enable button
    },
    error: (err) => {
      console.error('Error creating ticket:', err);
      this.toastr.error('Failed to create ticket.');
      this.isSubmitting = false; // ✅ Re-enable button
    }
  });
}


  

  resetForm(): void {
    // Reset the form values
    this.createTicketForm.reset();
  
    // Optionally, patch default values if needed:
    this.createTicketForm.patchValue({ status: 'Open', language: 'English' });
  
    // Reset the form state: mark all controls as untouched and pristine, and clear errors
    Object.keys(this.createTicketForm.controls).forEach(key => {
      const control = this.createTicketForm.get(key);
      control?.markAsPristine();
      control?.markAsUntouched();
      control?.setErrors(null);
    });
  
    // Also reset the contract selection
    this.resetDragAndDrop();
  }
  
  

 handleCountryChange(country: any): void {
  if (country?.language?.code) {
    this.selectedLanguageName = country.language.name;
    this.selectedCountryCode = country.code; // Set the language code
    this.selectedLanguageCode = country.language.code;
    this.createTicketForm.patchValue({
      language: this.selectedLanguageName,
      countryCode: this.selectedCountryCode, // Update countryCode'
      languageCode: this.selectedLanguageCode, // Update languageCode
    });
  } else {
    this.selectedLanguageName = 'English';
    this.selectedCountryCode = ''; // Default fallback
    this.selectedLanguageCode = ''; // Default fallback
    this.createTicketForm.patchValue({
      language: this.selectedLanguageName,
      countryCode: this.selectedCountryCode,
    });
  }
}

  

  dragStart(contract: Contract): void {
    this.draggedContract = contract;
  }

  dragEnd(): void {
    this.draggedContract = null;
  }

  drop(): void {
    if (this.draggedContract && !this.selectedContract) { // Prevent multiple drops
      const draggedIndex = this.findIndex(this.draggedContract);
  
      if (draggedIndex !== -1) {
        this.selectedContract = this.draggedContract;
        this.contracts.splice(draggedIndex, 1); // Remove from available contracts
        this.createTicketForm.get('contractId')?.setValue(this.selectedContract.id); // Update form
      }
  
      this.draggedContract = null;
    }
  }

  resetDragAndDrop(): void {
    if (this.selectedContract) {
      // Add the selected contract back to the available contracts list
      this.contracts.push(this.selectedContract);
      this.selectedContract = null; // Clear the selected contract
    }
  
    // Reset only the contractId field, preserving other values
    this.createTicketForm.patchValue({
      contractId: '' // Clear the contract ID field
    });
  
    this.toastr.info('Contract selection has been reset.');
  }


  findIndex(contract: Contract): number {
    let index = -1;
    for (let i = 0; i < this.contracts.length; i++) {
      if (contract.id === this.contracts[i].id) {
        index = i;
        break;
      }
    }
    return index;
  }

  logFormDetails(): void {
    console.log('Form Validity:', this.createTicketForm.valid);
    console.log('Form Errors:', this.createTicketForm.errors);
    console.log('Form Controls:');
    Object.keys(this.createTicketForm.controls).forEach((key) => {
      const control = this.createTicketForm.get(key);
      console.log(`${key} - Value:`, control?.value, 'Valid:', control?.valid, 'Errors:', control?.errors);
    });
  }
  
  

}
