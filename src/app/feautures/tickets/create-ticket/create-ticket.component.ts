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

@Component({
  selector: 'app-create-ticket',
  standalone: true,
  imports: [CurrencyPipe, ReactiveFormsModule, NgFor, NgIf,TableModule,DragDropModule,CommonModule],
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
  toastr = inject(ToastrService);
  contracts: Contract[] = [];
  selectedContract: Contract | null = null; // Store the dragged and dropped contract
  draggedContract: Contract | null = null; // Temporarily hold the dragged contract


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
    if (this.createTicketForm.invalid || !this.selectedContract) {
      this.toastr.error('Please fill all required fields and select a contract.');
      return;

      
    }

    if (!this.currentUser) {
      this.toastr.error('Current user is not available.');
      return;
    }

    const ticket: CreateTicket = {
      ...this.createTicketForm.value,
      contractId: this.selectedContract.id,
      creatorId: this.currentUser.id,
    };

    this.ticketService.createTicket(ticket).subscribe({
      next: () => {
        this.toastr.success('Ticket created successfully!');
        this.createTicketForm.reset();
        this.selectedContract = null;
      },
      error: (err) => {
        console.error('Error creating ticket:', err);
        this.toastr.error('Failed to create ticket.');
      },
    });
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
  
    this.toastr.info('Contract selection has been reset, but other form values are preserved.');
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
  

}
