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
  selectedContract: Contract | null = null;
  selectedFiles: File[] = [];
  acceptedTypes = '.pdf,.png,.jpeg,.jpg,.zip';
  isSubmitting = false;
  isMobile: boolean = false;

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
  ];

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

  selectedLanguageName = 'English';
  selectedCountryCode = '';
  selectedLanguageCode = '';
  showCountryList = true;

  ngOnInit(): void {
    this.isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    this.currentUserName = this.accountService.currentUser()?.userName ?? '';
    this.loadUserDetails();
    this.initForm();
  }

  initForm(): void {
    this.createTicketForm = new FormGroup({
      title: new FormControl('', [Validators.required, Validators.minLength(5)]),
      description: new FormControl('', [Validators.required, Validators.minLength(10)]),
      priority: new FormControl('Medium', Validators.required),
      type: new FormControl('Bug', Validators.required),
      status: new FormControl('Open', Validators.required),
      contractId: new FormControl('', Validators.required),
      creatorId: new FormControl({ value: '', disabled: true }),
      language: new FormControl(this.selectedLanguageName, Validators.required),
      countryCode: new FormControl(this.selectedCountryCode, Validators.required),
      languageCode: new FormControl(this.selectedLanguageCode, Validators.required),
    });
  }

  onFilesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const allowedExtensions = ['pdf', 'png', 'jpeg', 'jpg', 'zip'];
    const maxSizeMB = 10;

    Array.from(input.files).forEach(file => {
      const ext = file.name.split('.').pop()?.toLowerCase();
      const sizeMB = file.size / (1024 * 1024);

      if (!ext || !allowedExtensions.includes(ext)) {
        this.toastr.warning(`File type not allowed: ${file.name}`);
        return;
      }

      if (sizeMB > maxSizeMB) {
        this.toastr.error(`File too large: ${file.name}`);
        return;
      }

      if (!this.selectedFiles.find(f => f.name === file.name && f.size === file.size)) {
        this.selectedFiles.push(file);
      }
    });

    input.value = '';
  }

  removeFile(index: number): void {
    this.selectedFiles.splice(index, 1);
    const fileInput = document.getElementById('fileUpload') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  }

  loadUserDetails(): void {
    if (!this.currentUserName) {
      this.toastr.error('Username is required.');
      return;
    }

    this.userappService.getUsersapp_username(this.currentUserName).subscribe({
      next: user => {
        this.currentUser = user;
        this.fetchContractsByUserCompany(user.companyName);
      },
      error: err => {
        console.error('Error fetching user:', err);
        this.toastr.error('Failed to fetch user details.');
      }
    });
  }

  fetchContractsByUserCompany(companyName: string): void {
    this.contractService.getContractsByBeneficiaryCompanyName(companyName).subscribe({
      next: data => {
        this.contracts = data;
        if (data.length === 0) {
          this.toastr.warning('No contracts found.');
        }
      },
      error: err => {
        console.error('Error fetching contracts:', err);
        this.toastr.error('Failed to fetch contracts.');
      }
    });
  }

  selectContract(contract: Contract): void {
    if (!this.selectedContract) {
      const index = this.findIndex(contract);
      if (index !== -1) {
        this.selectedContract = contract;
        this.contracts.splice(index, 1);
        this.createTicketForm.get('contractId')?.setValue(contract.id);
      }
    }
  }

  resetDragAndDrop(): void {
    if (this.selectedContract) {
      this.contracts.push(this.selectedContract);
      this.selectedContract = null;
      this.createTicketForm.patchValue({ contractId: '' });
    }
    this.toastr.info('Contract selection reset.');
  }

  handleCountryChange(country: any): void {
    if (country?.language?.code) {
      this.selectedLanguageName = country.language.name;
      this.selectedCountryCode = country.code;
      this.selectedLanguageCode = country.language.code;

      this.createTicketForm.patchValue({
        language: this.selectedLanguageName,
        countryCode: this.selectedCountryCode,
        languageCode: this.selectedLanguageCode,
      });
    } else {
      this.selectedLanguageName = 'English';
      this.selectedCountryCode = '';
      this.selectedLanguageCode = '';
      this.createTicketForm.patchValue({
        language: this.selectedLanguageName,
        countryCode: this.selectedCountryCode,
      });
    }
  }

  submitTicket(): void {
    if (this.createTicketForm.invalid || !this.selectedContract || !this.currentUser) {
      this.createTicketForm.markAllAsTouched();
      this.toastr.error('Fill required fields and select a contract.');
      return;
    }

    this.isSubmitting = true;
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
        this.toastr.success('Ticket created!');
        this.resetForm();
        this.router.navigate(['/home']);
        this.isSubmitting = false;
      },
      error: err => {
        console.error('Create error:', err);
        this.toastr.error('Ticket creation failed.');
        this.isSubmitting = false;
      }
    });
  }

  resetForm(): void {
    this.createTicketForm.reset();
    this.createTicketForm.patchValue({ status: 'Open', language: 'English' });

    Object.keys(this.createTicketForm.controls).forEach(key => {
      const control = this.createTicketForm.get(key);
      control?.markAsPristine();
      control?.markAsUntouched();
      control?.setErrors(null);
    });

    this.resetDragAndDrop();
    this.selectedFiles = [];
  }

  findIndex(contract: Contract): number {
    return this.contracts.findIndex(c => c.id === contract.id);
  }
}
