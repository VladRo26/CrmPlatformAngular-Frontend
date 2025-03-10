import { Directive, inject, Input, TemplateRef, ViewContainerRef, OnInit} from '@angular/core';
import { AccountService } from '../_services/account.service';


@Directive({
  selector: '[appNothasRole]',
  standalone: true
})
export class NothasRoleDirective implements OnInit {
  @Input() appNothasRole: string[] = [];
  
  private accountService = inject(AccountService);
  private viewContainerRef = inject(ViewContainerRef);
  private templateRef = inject(TemplateRef<any>);

  ngOnInit(): void {
    // If the user does NOT have any of the specified roles, then show the template.
    if (!this.accountService.roles()?.some((r: string) => this.appNothasRole.includes(r))) {
      this.viewContainerRef.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainerRef.clear();
    }
  }




}
