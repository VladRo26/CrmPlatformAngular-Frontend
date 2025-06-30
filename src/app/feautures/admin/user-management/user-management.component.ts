import { Component, inject, OnInit } from '@angular/core';
import { AdminService } from '../../../_services/admin.service';
import { User } from '../../../_models/user';
import {MatTableDataSource, MatTableModule} from '@angular/material/table';
import {MatButtonModule} from '@angular/material/button';
import { DialogModule } from 'primeng/dialog';
import { CheckboxModule } from 'primeng/checkbox';
import { FormsModule } from '@angular/forms';
import {NgFor, NgIf} from '@angular/common';
import { User2 } from '../../../_models/user2';
import { ToastrService } from 'ngx-toastr';
import {MatIconModule} from '@angular/material/icon';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [MatTableModule,MatButtonModule,DialogModule,CheckboxModule,FormsModule,NgFor,NgIf,MatIconModule],
  templateUrl: './user-management.component.html',
  styleUrl: './user-management.component.css'
})
export class UserManagementComponent implements OnInit {
  private adminService = inject(AdminService);
  private toastr = inject(ToastrService); // ✅ Inject ToastrService

  displayedColumns: string[] = ['username', 'roles', 'actions']; // Define table columns
  dataSource: MatTableDataSource<User> = new MatTableDataSource<User>();
  roles: string[] = []; // Store available roles
  selectedRoles: string[] = []; // Store selected roles for the dialog
  visible = false; // Dialog visibility
  selectedUser: User2 | null = null; // Currently selected user
  ngOnInit(): void {
    this.getUserWithRoles();
    this.loadAllRoles();

  }

  getUserWithRoles() {
    this.adminService.getUserwithRole().subscribe(users => {
      this.dataSource = new MatTableDataSource(users); // Assign fetched users to the data source
    });
  }


  loadAllRoles() {
    this.roles = ['Admin', 'Moderator', 'User', 'Default']; // Simplified roles
  }

  editRoles(user: User2): void {
    this.selectedUser = user; // Set the selected user
    this.selectedRoles = [...user.roles]; // Clone the user's current roles
    this.visible = true; // Open the dialog
  }

  saveRoles(): void {
    if (!this.selectedUser) return;

    this.adminService.editRoles(this.selectedUser.username, this.selectedRoles).subscribe({
      next: (updatedRoles) => {
        if (this.selectedUser) {
          this.selectedUser.roles = updatedRoles; // Update roles locally
        }
        this.visible = false; // Close the dialog
      },
      error: (err) => console.error('Failed to update roles:', err),
    });
  }

  toggleRole(role: string): void {
    if (this.selectedRoles.includes(role)) {
      this.selectedRoles = this.selectedRoles.filter((r) => r !== role);
    } else {
      this.selectedRoles.push(role);
    }
    console.log('Updated selected roles:', this.selectedRoles); // Debug: Confirm role toggling
  }

  deleteUser(username: string): void {
    if (confirm(`Are you sure you want to delete ${username}?`)) {
      this.adminService.deleteUser(username).subscribe({
        next: () => {
          this.toastr.success(`User ${username} deleted successfully`);
          // Re-fetch the updated user list instead of reloading the page
          this.getUserWithRoles();
        },
        error: (err) => {
          console.error('Failed to delete user:', err);
          this.toastr.error(`Failed to delete ${username}`);
        },
      });
    }
  }
}
