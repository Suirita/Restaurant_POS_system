import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../user.service';
import { UserAccount } from '../../../types/pos.types';
import { LucideAngularModule, Edit, Trash2 } from 'lucide-angular';

@Component({
  standalone: true,
  selector: 'app-users-settings',
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './users-settings.html',
})
export class UsersSettingsComponent implements OnInit {
  readonly edit = Edit;
  readonly trash2 = Trash2;

  private userService = inject(UserService);

  users = signal<UserAccount[]>([]);
  showUserForm = signal<boolean>(false);
  editingUser = signal<UserAccount | null>(null);

  newUser: Omit<UserAccount, 'userId' | 'token'> & { reference: string } = {
    username: '',
    fullName: '',
    roleName: '',
    reference: '',
  };

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe((users) => {
      this.users.set(users);
    });
  }

  openCreateForm(): void {
    this.editingUser.set(null);
    this.newUser = { username: '', fullName: '', roleName: '', reference: '' };
    this.showUserForm.set(true);
  }

  openEditForm(user: UserAccount): void {
    this.editingUser.set(user);
    this.newUser = { ...user, reference: '' }; // Populate form with existing user data
    this.showUserForm.set(true);
  }

  saveUser(): void {
    if (this.editingUser()) {
      // Update existing user
      this.userService.updateUser(this.editingUser()!).subscribe(() => {
        this.loadUsers();
        this.showUserForm.set(false);
      });
    } else {
      // Create new user
      this.userService.createUser(this.newUser).subscribe(() => {
        this.loadUsers();
        this.showUserForm.set(false);
      });
    }
  }

  deleteUser(userId: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      const idToDelete = userId.split('::')[0];
      this.userService.deleteUser(idToDelete).subscribe(() => {
        this.loadUsers();
      });
    }
  }

  cancelForm(): void {
    this.showUserForm.set(false);
    this.editingUser.set(null);
  }
}
