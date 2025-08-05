import {
  Component,
  OnInit,
  signal,
  inject,
  input,
  output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ClientService } from '../../client.service';
import { KeyboardService } from '../../keyboard.service';
import { Client } from '../../types/pos.types';
import { LucideAngularModule, X, Users } from 'lucide-angular';

@Component({
  selector: 'app-client-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './client-form-modal.html',
})
export class ClientFormModalComponent implements OnInit {
  private keyboardService = inject(KeyboardService);
  private clientService = inject(ClientService);

  editingClient = input<Client | null>(null);
  token = input.required<string>();
  newClient = signal<Client>({} as Client);
  isInputFocused = signal<boolean>(false);

  readonly XIcon = X;
  readonly Users = Users;

  close = output<void>();
  clientSaved = output<void>();

  ngOnInit() {
    if (this.editingClient()) {
      this.newClient.set({ ...this.editingClient()! });
    } else {
      this.newClient.set({} as Client);
    }
  }

  saveClient() {
    if (this.editingClient()) {
      this.clientService
        .updateClient(this.newClient(), this.token())
        .subscribe(() => {
          this.clientSaved.emit();
        });
    } else {
      this.clientService
        .createClient(this.newClient(), this.token())
        .subscribe(() => {
          this.clientSaved.emit();
        });
    }
  }

  updateNewClient<K extends keyof Client>(key: K, value: Client[K]) {
    this.newClient.update((client) => ({ ...client, [key]: value }));
  }

  openKeyboard(): void {
    this.keyboardService.openOnScreenKeyboard();
  }

  closeKeyboard(): void {
    this.keyboardService.closeOnScreenKeyboard();
  }

  cancelForm() {
    this.close.emit();
  }
}
