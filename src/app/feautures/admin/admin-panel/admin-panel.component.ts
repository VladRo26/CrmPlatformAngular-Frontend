import { Component } from '@angular/core';
import {MatTabsModule} from '@angular/material/tabs';
import { UserManagementComponent } from '../user-management/user-management.component';
import { HasRoleDirective } from '../../../_directives/has-role.directive';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [MatTabsModule, UserManagementComponent,HasRoleDirective],
  templateUrl: './admin-panel.component.html',
  styleUrl: './admin-panel.component.css'
})
export class AdminPanelComponent {

}
