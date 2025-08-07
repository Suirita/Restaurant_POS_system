import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../../client.service';
import { Client } from '../../../types/pos.types';
import { UserAccount } from '../../../types/pos.types';
import {
  LucideAngularModule,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
} from 'lucide-angular';
import { ClientFormModalComponent } from '../../client-form-modal/client-form-modal';
import { ReusableTable } from '../../reusable-table/reusable-table';

@Component({
  selector: 'app-clients-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    LucideAngularModule,
    ClientFormModalComponent,
    ReusableTable,
  ],
  templateUrl: './clients-settings.html',
})
export class ClientsSettingsComponent implements OnInit {
  readonly ChevronLeftIcon = ChevronLeft;
  readonly ChevronRightIcon = ChevronRight;
  readonly edit = Edit;
  readonly trash2 = Trash2;

  private clientService = inject(ClientService);
  clients = signal<Client[]>([]);
  currentUser = signal<UserAccount | null>(null);
  showClientForm = signal(false);
  editingClient = signal<Client | null>(null);

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
