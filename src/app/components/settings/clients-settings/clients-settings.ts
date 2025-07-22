import { Component, OnInit, signal, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../../client.service';
import { Client } from '../../../types/pos.types';
import { UserAccount } from '../../../types/pos.types';
import { LucideAngularModule } from 'lucide-angular';

@Component({
  selector: 'app-clients-settings',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './clients-settings.html',
})
export class ClientsSettingsComponent implements OnInit {
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
    this.clientService.getClients(this.currentUser()?.token).subscribe((data) => {
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
    // Here you would call the service to save the client
    // For now, we just close the form
    this.showClientForm.set(false);
  }

  deleteClient(client: Client) {
    // Here you would call the service to delete the client
  }

  updateNewClient<K extends keyof Client>(key: K, value: Client[K]) {
    this.newClient.update(client => ({ ...client, [key]: value }));
  }
}
