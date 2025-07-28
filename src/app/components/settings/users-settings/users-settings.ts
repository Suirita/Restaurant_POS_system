import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { KeyboardService } from '../../../keyboard.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../user.service';
import { RoleService } from '../../../role.service';
import { UserAccount, Role, UserImage } from '../../../types/pos.types';
import {
  LucideAngularModule,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-angular';
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
  readonly ChevronLeftIcon = ChevronLeft;
  readonly ChevronRightIcon = ChevronRight;

  private userService = inject(UserService);
  private roleService = inject(RoleService);
  private keyboardService = inject(KeyboardService);

  users = signal<UserAccount[]>([]);
  roles = signal<Role[]>([]);
  showUserForm = signal<boolean>(false);
  editingUser = signal<UserAccount | null>(null);
  imagePreview = signal<string | null>(null);
  isInputFocused   = signal<boolean>(false);

  // Filtering and Search
  searchTerm = signal<string>('');
  selectedRole = signal<string>('');

  filteredUsers = computed(() => {
    const term = this.searchTerm().toLowerCase();
    const role = this.selectedRole();
    return this.users().filter(
      (user) =>
        user.fullName.toLowerCase().includes(term) &&
        (role === '' || user.roleName === role)
    );
  });

  // Pagination
  currentPage = signal<number>(1);
  totalPages = computed(() => Math.ceil(this.filteredUsers().length / 10));
  paginatedUsers = computed(() => {
    const startIndex = (this.currentPage() - 1) * 10;
    const endIndex = startIndex + 10;
    return this.filteredUsers().slice(startIndex, endIndex);
  });
  pages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const maxVisible = 5;
    let start = Math.max(1, current - 2);
    let end = Math.min(total, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  });

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
        this.goToPage(1);
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

  onSearchTermChange(event: Event): void {
    const term = (event.target as HTMLInputElement).value;
    this.searchTerm.set(term);
    this.goToPage(1);
  }

  onRoleChange(event: Event): void {
    const role = (event.target as HTMLSelectElement).value;
    this.selectedRole.set(role);
    this.goToPage(1);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
  }

  nextPage(): void {
    this.goToPage(this.currentPage() + 1);
  }

  previousPage(): void {
    this.goToPage(this.currentPage() - 1);
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
    return (
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
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

  openKeyboard(): void {
    this.keyboardService.openOnScreenKeyboard();
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'https://placehold.co/1280x720';
  }
}
