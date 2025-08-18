import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { KeyboardService } from '../../../keyboard.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../../user.service';
import { RoleService } from '../../../role.service';
import { UserAccount, Role } from '../../../types/pos.types';
import {
  LucideAngularModule,
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-angular';
import { forkJoin, of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';
import { UserFormModalComponent } from '../../user-form-modal/user-form-modal';
import { ReusableTable } from '../../reusable-table/reusable-table';
import { PaginationComponent } from '../../pagination/pagination';
import {
  CustomSelectComponent,
  Option,
} from '../../custom-select/custom-select';

@Component({
  standalone: true,
  selector: 'app-users-settings',
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule,
    UserFormModalComponent,
    ReusableTable,
    PaginationComponent,
    CustomSelectComponent,
  ],
  templateUrl: './users-settings.html',
})
export class UsersSettingsComponent implements OnInit {
  readonly Search = Search;
  readonly Plus = Plus;
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

  roleOptions = computed<Option[]>(() => {
    const allRolesOption: Option = { value: '', label: 'Tous les rôles' };
    const roleOptions: Option[] = this.roles().map((role) => ({
      value: role.name,
      label: role.name === 'Direction' ? 'admin' : 'serveur',
    }));
    return [allRolesOption, ...roleOptions];
  });

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
  paginatedUsers = computed(() => {
    const startIndex = (this.currentPage() - 1) * 10;
    const endIndex = startIndex + 10;
    return this.filteredUsers()
      .slice(startIndex, endIndex)
      .map((user) => ({
        ...user,
        image:
          user.image && user.image.content
            ? user.image.content
            : 'https://placehold.co/1280x720',
      }));
  });

  tableColumns = ['Image', 'Nom complet', 'Mot de passe', 'Téléphone', 'Rôle'];
  tableColumnKeys = [
    'image',
    'fullName',
    'username',
    'phoneNumber',
    'roleName',
  ];

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
          if (users.length === 0) {
            return of([]);
          }
          const userObservables = users.map((user) => {
            if (user.image && user.image.fileId) {
              return this.userService.getFile(user.image.fileId).pipe(
                map((file) => {
                  // The API returns the full data URL in file.value
                  if (file && file.value && typeof file.value === 'string') {
                    user.image!.content = file.value; // Assign the full data URL
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
        this.currentPage.set(1);
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
    this.currentPage.set(1);
  }

  onRoleChange(role: string): void {
    this.selectedRole.set(role);
    this.currentPage.set(1);
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
  }

  getImageUrl(user: UserAccount): string {
    // user.image.content is now expected to be a full data URL.
    if (user.image && user.image.content) {
      return user.image.content;
    }
    return 'https://placehold.co/1280x720';
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

  deleteUser(userId: string): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(userId).subscribe(() => {
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
    const element = event.target as HTMLImageElement;
    if (element.src !== 'https://placehold.co/1280x720') {
      element.src = 'https://placehold.co/1280x720';
    }
  }
}