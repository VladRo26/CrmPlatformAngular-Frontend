import { Component, inject, OnInit } from '@angular/core';
import { ContractCardComponent } from '../contract-card/contract-card.component';
import { ContractService } from '../../../_services/contract.service';
import { Contract } from '../../../_models/contract';

@Component({
  selector: 'app-contract-list',
  standalone: true,
  imports: [ContractCardComponent],
  templateUrl: './contract-list.component.html',
  styleUrl: './contract-list.component.css'
})
export class ContractListComponent implements OnInit {
  private contractService = inject(ContractService);
  contracts: Contract[] = [];

  ngOnInit(): void {
    this.loadContracts();
  }

  loadContracts() {
    this.contractService.getContracts().subscribe({
      next: contracts => this.contracts = contracts
    })
  }


}
