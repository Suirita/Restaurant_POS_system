import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../user.service';
import { RoleService } from '../../../role.service';
import { UserAccount, Role } from '../../../types/pos.types';
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
  private roleService = inject(RoleService);

  users = signal<UserAccount[]>([]);
  roles = signal<Role[]>([]);
  showUserForm = signal<boolean>(false);
  editingUser = signal<UserAccount | null>(null);

  newUser: UserAccount & { reference: string; isAdmin: boolean } = {
    userId: '',
    username: '',
    fullName: '',
    roleName: 'utilisateur',
    token: '',
    reference: '',
    phoneNumber: '',
    isAdmin: false,
  };

  ngOnInit(): void {
    this.loadUsers();
    this.loadRoles();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe((users) => {
      this.users.set(users);
    });
  }

  loadRoles(): void {
    this.roleService.getRoles().subscribe((roles) => {
      this.roles.set(
        roles.filter(
          (role) => role.name === 'Direction' || role.name === 'utilisateur'
        )
      );
    });
  }

  openCreateForm(): void {
    this.editingUser.set(null);
    this.newUser = {
      userId: '',
      username: '',
      fullName: '',
      roleName: 'utilisateur',
      token: '',
      reference: '',
      phoneNumber: '',
      isAdmin: false,
    };
    this.showUserForm.set(true);
  }

  openEditForm(user: UserAccount): void {
    this.editingUser.set(user);
    this.newUser = {
      ...user,
      reference: user.reference || '',
      phoneNumber: user.phoneNumber || '',
      isAdmin: user.roleName === 'Direction',
    };
    this.showUserForm.set(true);
  }

  saveUser(): void {
    const roleName = this.newUser.isAdmin ? 'Direction' : 'utilisateur';
    const role = this.roles().find((r) => r.name === roleName);

    if (!role) {
      console.error('Role not found');
      return;
    }

    const userToSave: UserAccount = {
      ...this.newUser,
      roleName: role.name,
      roleId: role.id,
    };

    if (this.editingUser()) {
      this.userService.updateUser(userToSave).subscribe(() => {
        this.loadUsers();
        this.showUserForm.set(false);
      });
    } else {
      this.userService.createUser(userToSave).subscribe(() => {
        this.loadUsers();
        this.showUserForm.set(false);
      });
    }
  }

  deleteUser(user: UserAccount): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(user.userId).subscribe(() => {
        this.loadUsers();
      });
    }
  }

  cancelForm(): void {
    this.showUserForm.set(false);
    this.editingUser.set(null);
  }
}
