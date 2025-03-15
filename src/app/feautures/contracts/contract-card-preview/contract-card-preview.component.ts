import { Component, Input } from '@angular/core';
import { Contract } from '../../../_models/contract';
import { MatCardModule } from '@angular/material/card';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { KnobModule } from 'primeng/knob';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-contract-card-preview',
  standalone: true,
  imports: [MatCardModule,CurrencyPipe,DatePipe,KnobModule,NgIf,FormsModule],
  templateUrl: './contract-card-preview.component.html',
  styleUrl: './contract-card-preview.component.css'
})
export class ContractCardPreviewComponent {
  @Input() contract!: Contract;


}
