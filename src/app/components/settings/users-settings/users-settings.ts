import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { KeyboardService } from '../../../keyboard.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../user.service';
import { RoleService } from '../../../role.service';
import { UserAccount, Role } from '../../../types/pos.types';
import {
  LucideAngularModule,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-angular';
import { forkJoin, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { UserFormModalComponent } from '../../user-form-modal/user-form-modal';

@Component({
  standalone: true,
  selector: 'app-users-settings',
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule,
    UserFormModalComponent,
  ],
  templateUrl: './users-settings.html',
})
export class UsersSettingsComponent implements OnInit {
  readonly edit = Edit;
  readonly trash2 = Trash2;
  readonly ChevronLeftIcon = ChevronLeft;
  readonly ChevronRightIcon = ChevronRight;
  readonly XIcon = X;

  private userService = inject(UserService);
  private roleService = inject(RoleService);
  private keyboardService = inject(KeyboardService);

  users = signal<UserAccount[]>([]);
  roles = signal<Role[]>([]);
  showUserForm = signal<boolean>(false);
  editingUser = signal<UserAccount | null>(null);
  token = signal<string>(''); // You might need to get this from a service

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

  ngOnInit(): void {
    this.loadUsers();
    this.loadRoles();
    // You should get the actual token from your auth service
    const currentUser = JSON.parse(localStorage.getItem('currentUser')!);
    this.token.set(currentUser?.token || '');
  }

  loadUsers(): void {
    this.userService
      .getUsers()
      .pipe(
        switchMap((users) => {
          const userObservables = users.map((user) => {
            if (user.image) {
              // Assuming image is base64. If not, adjust logic.
              return of(user);
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
    if (user.image) {
      return user.image as string;
    }
    return 'https://via.placeholder.com/150'; // Default placeholder
  }

  openCreateForm(): void {
    this.editingUser.set(null);
    this.showUserForm.set(true);
  }

  openEditForm(user: UserAccount): void {
    this.editingUser.set(user);
    this.showUserForm.set(true);
  }

  onUserSaved(): void {
    this.showUserForm.set(false);
    this.editingUser.set(null);
    this.loadUsers();
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

  closeKeyboard(): void {
    this.keyboardService.closeOnScreenKeyboard();
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'https://placehold.co/1280x720';
  }
}
