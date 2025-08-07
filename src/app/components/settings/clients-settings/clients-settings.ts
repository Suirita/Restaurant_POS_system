import { Component, OnInit, signal, inject, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../../client.service';
import { Client } from '../../../types/pos.types';
import { UserAccount } from '../../../types/pos.types';
import {
  LucideAngularModule,
  Search,
  Plus,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-angular';
import { ClientFormModalComponent } from '../../client-form-modal/client-form-modal';
import { ReusableTable } from '../../reusable-table/reusable-table';
import { PaginationComponent } from '../../pagination/pagination';

@Component({
  selector: 'app-clients-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule,
    ClientFormModalComponent,
    ReusableTable,
    PaginationComponent,
  ],
  templateUrl: './clients-settings.html',
})
export class ClientsSettingsComponent implements OnInit {
  readonly Search = Search;
  readonly Plus = Plus;
  readonly edit = Edit;
  readonly trash2 = Trash2;
  readonly ChevronLeftIcon = ChevronLeft;
  readonly ChevronRightIcon = ChevronRight;

  private clientService = inject(ClientService);
  clients = signal<Client[]>([]);
  currentUser = signal<UserAccount | null>(null);
  showClientForm = signal(false);
  editingClient = signal<Client | null>(null);

  // Filtering and Search
  searchTerm = signal<string>('');
  filteredClients = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.clients().filter((client) =>
      client.name.toLowerCase().includes(term)
    );
  });

  // Pagination
  currentPage = signal<number>(1);
  paginatedClients = computed(() => {
    const startIndex = (this.currentPage() - 1) * 10;
    const endIndex = startIndex + 10;
    return this.filteredClients().slice(startIndex, endIndex);
  });

  tableColumns = [
    'Nom',
    'Email',
    'Mobile',
    'ICE',
    'Adresse',
    'Code postal',
    'Ville',
    'Pays',
  ];
  tableColumnKeys = [
    'name',
    'email',
    'mobile',
    'ice',
    'address',
    'postalCode',
    'city',
    'country',
  ];

  ngOnInit() {
    const user = localStorage.getItem('user');
    if (user) {
      this.currentUser.set(JSON.parse(user));
    }
    this.loadClients();
  }

  loadClients() {
    this.clientService
      .getClients(this.currentUser()?.token)
      .subscribe((data) => {
        this.clients.set(data);
      });
  }

  onSearchTermChange(event: Event): void {
    const term = (event.target as HTMLInputElement).value;
    this.searchTerm.set(term);
    this.currentPage.set(1);
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
  }

  openCreateForm() {
    this.editingClient.set(null);
    this.showClientForm.set(true);
  }

  openEditForm(client: Client) {
    this.editingClient.set(client);
    this.showClientForm.set(true);
  }

  closeClientForm() {
    this.showClientForm.set(false);
  }

  onClientSaved() {
    this.loadClients();
    this.closeClientForm();
  }

  deleteClient(clientId: string) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      this.clientService
        .deleteClient(clientId, this.currentUser()?.token)
        .subscribe(() => {
          this.loadClients();
        });
    }
  }
}
