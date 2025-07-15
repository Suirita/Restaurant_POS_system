import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../user.service';
import { RoleService } from '../../../role.service';
import { UserAccount, Role, UserImage } from '../../../types/pos.types';
import { LucideAngularModule, Edit, Trash2 } from 'lucide-angular';
import { forkJoin, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

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
  imagePreview = signal<string | null>(null);

  newUser: UserAccount & { reference: string; isAdmin: boolean } = {
    userId: '',
    username: '',
    fullName: '',
    roleName: 'utilisateur',
    token: '',
    reference: '',
    phoneNumber: '',
    isAdmin: false,
    image: null,
  };

  ngOnInit(): void {
    this.loadUsers();
    this.loadRoles();
  }

  loadUsers(): void {
    this.userService
      .getUsers()
      .pipe(
        switchMap((users) => {
          const userObservables = users.map((user) => {
            if (user.image && user.image.fileId) {
              return this.userService.getFile(user.image.fileId).pipe(
                map((response) => {
                  if (response.hasValue && user.image) {
                    user.image.content = response.value;
                  }
                  return user;
                })
              );
            }
            return of(user);
          });
          return forkJoin(userObservables);
        })
      )
      .subscribe((users) => {
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

  getImageUrl(user: UserAccount): string {
    if (user.image && user.image.content) {
      return user.image.content;
    }
    return 'https://via.placeholder.com/150'; // Default placeholder
  }

  openCreateForm(): void {
    this.editingUser.set(null);
    this.imagePreview.set(null);
    this.newUser = {
      userId: '',
      username: '',
      fullName: '',
      roleName: 'utilisateur',
      token: '',
      reference: '',
      phoneNumber: '',
      isAdmin: false,
      image: null,
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

    if (user.image && user.image.content) {
      this.imagePreview.set(user.image.content);
    } else {
      this.imagePreview.set(null);
    }

    this.showUserForm.set(true);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const content = reader.result as string;
        this.imagePreview.set(content);
        const fileType = file.type.split('/')[1] || '';
        this.newUser.image = {
          fileId: this.generateSimpleId(),
          content: content,
          fileName: file.name,
          fileType: fileType,
        };
      };
      reader.readAsDataURL(file);
    }
  }

  generateSimpleId(): string {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
  }

  saveUser(): void {
    const roleName = this.newUser.isAdmin ? 'Direction' : 'utilisateur';
    const role = this.roles().find((r) => r.name === roleName);

    if (!role) {
      console.error('Role not found');
      return;
    }

    const saveUserAction = (image: UserImage | null | undefined) => {
      const userToSave: UserAccount = {
        ...this.newUser,
        roleName: role.name,
        roleId: role.id,
        image: image,
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
    };

    if (this.newUser.image && this.newUser.image.content) {
      const imageToSave = {
        id: this.newUser.image.fileId as string,
        base64: this.newUser.image.content as string,
      };
      this.userService.saveFile(imageToSave).subscribe(() => {
        saveUserAction(this.newUser.image);
      });
    } else {
      saveUserAction(this.newUser.image);
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
