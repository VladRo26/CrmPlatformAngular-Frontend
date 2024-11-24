import { Component, inject , input} from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { RouterLinkActive } from '@angular/router'
import { Contract } from '../../../_models/contract';
import { MatButtonModule } from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import { CurrencyPipe } from '@angular/common';
import { DatePipe } from '@angular/common';
import { PercentPipe } from '@angular/common';
import { KnobModule } from 'primeng/knob';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-contract-card',
  standalone: true,
  imports: [MatButtonModule,MatCardModule,RouterLink,RouterLinkActive,CurrencyPipe,DatePipe,PercentPipe,KnobModule,FormsModule],
  templateUrl: './contract-card.component.html',
  styleUrl: './contract-card.component.css'
})
export class ContractCardComponent {
  private router = inject(Router);

  contract = input.required<Contract>(); 


}
