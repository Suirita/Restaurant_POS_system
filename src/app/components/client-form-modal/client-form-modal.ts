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
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';

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
  iceExistsError = signal<boolean>(false);

  private iceInputChanged = new Subject<string>();

  readonly XIcon = X;
  readonly Users = Users;

  close = output<void>();
  clientSaved = output<void>();

  ngOnInit() {
    if (this.editingClient()) {
      this.newClient.set({ ...this.editingClient()! });
      this.iceExistsError.set(false);
    } else {
      this.newClient.set({} as Client);
    }

    this.iceInputChanged.pipe(
      debounceTime(300),
      distinctUntilChanged()
    ).subscribe((ice) => {
      this.checkIceExistence(ice);
    });
  }

  saveClient() {
    if (this.iceExistsError()) {
      return;
    }

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
    this.newClient.update((client) => ({
      ...client,
      [key]: value
    }));
    if (key === 'ice') {
      this.iceInputChanged.next(value as string);
    }
  }

  checkIceExistence(ice: string) {
    if (!ice) {
      this.iceExistsError.set(false);
      return;
    }

    // If editing, allow the current client's ICE to pass
    if (this.editingClient() && this.editingClient()?.ice === ice) {
      this.iceExistsError.set(false);
      return;
    }

    this.clientService.checkIceExists(ice, this.token()).subscribe((exists) => {
      this.iceExistsError.set(exists);
    });
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
