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

@Component({
  selector: 'app-clients-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
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
  newClient = signal<Client>({} as Client);

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
    this.newClient.set({} as Client);
    this.showClientForm.set(true);
  }

  openEditForm(client: Client) {
    this.editingClient.set(client);
    this.newClient.set({ ...client });
    this.showClientForm.set(true);
  }

  cancelForm() {
    this.showClientForm.set(false);
  }

  saveClient() {
    if (this.editingClient()) {
      this.clientService
        .updateClient(this.newClient(), this.currentUser()?.token)
        .subscribe(() => {
          this.loadClients();
          this.showClientForm.set(false);
        });
    } else {
      this.clientService
        .createClient(this.newClient(), this.currentUser()?.token)
        .subscribe(() => {
          this.loadClients();
          this.showClientForm.set(false);
        });
    }
  }

  deleteClient(client: Client) {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce client ?')) {
      this.clientService
        .deleteClient(client.id, this.currentUser()?.token)
        .subscribe(() => {
          this.loadClients();
        });
    }
  }

  updateNewClient<K extends keyof Client>(key: K, value: Client[K]) {
    this.newClient.update((client) => ({ ...client, [key]: value }));
  }
}
