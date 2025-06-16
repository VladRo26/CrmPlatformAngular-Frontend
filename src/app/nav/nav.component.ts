import { Component, HostListener, inject,ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../_services/account.service';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { Router, RouterLink } from '@angular/router';
import { RouterLinkActive } from '@angular/router';
import { TitleCasePipe } from '@angular/common';
import { HasRoleDirective} from '../_directives/has-role.directive'
import { NothasRoleDirective } from '../_directives/nothas-role.directive';
import { ChangeDetectorRef } from '@angular/core';
import { NgIf,NgClass } from '@angular/common';

@Component({
  selector: 'app-nav',
  standalone: true,
  imports: [BsDropdownModule,RouterLink,RouterLinkActive,TitleCasePipe
    ,NgClass,HasRoleDirective,NgIf,NothasRoleDirective],
  templateUrl: './nav.component.html',
  styleUrl: './nav.component.css'
})
export class NavComponent {
  model: any = {};
  isCollapsed = true;
  accountService = inject(AccountService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  private elementRef = inject(ElementRef);

  login() {
    this.accountService.login(this.model).subscribe({
      next: () => {
        this.router.navigateByUrl('/home');
        this.cdr.detectChanges();
      },
      error: error => console.log(error)
    });
  }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
    this.cdr.detectChanges();
  }

@HostListener('document:click', ['$event'])
onDocumentClick(event: MouseEvent): void {
  const targetElement = event.target as Node;
  const hostElement = this.elementRef.nativeElement as HTMLElement;

  const clickedInside = hostElement.contains(targetElement);
  if (!clickedInside && window.innerWidth < 992) {
    this.isCollapsed = true;
  }
}

}
