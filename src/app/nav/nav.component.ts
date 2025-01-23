import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../_services/account.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { Router, RouterLink } from '@angular/router';
import { RouterLinkActive } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { HasRoleDirective} from '../_directives/has-role.directive'
import { ChangeDetectorRef } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [BsDropdownModule,RouterLink,RouterLinkActive,TitleCasePipe,HasRoleDirective,NgIf],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
  model: any = {};
  accountService = inject(AccountService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef); // Inject ChangeDetectorRef

  
  login(){
    this.accountService.login(this.model).subscribe({
      next: response => {
        console.log(response);
        this.router.navigateByUrl('/home');
        this.cdr.detectChanges(); // Trigger change detection after login

      },
      error: error => {
        console.log(error);
      }
    })
 }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
    this.cdr.detectChanges(); // Trigger change detection after login

  }
}
