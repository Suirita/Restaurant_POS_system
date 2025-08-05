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
import { UserService } from '../../user.service';
import { KeyboardService } from '../../keyboard.service';
import { UserAccount, UserImage } from '../../types/pos.types';
import { LucideAngularModule, X, User, Camera, Upload } from 'lucide-angular';

@Component({
  selector: 'app-user-form-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './user-form-modal.html',
})
export class UserFormModalComponent implements OnInit {
  private keyboardService = inject(KeyboardService);
  private userService = inject(UserService);

  editingUser = input<UserAccount | null>(null);
  token = input.required<string>();
  newUser = signal<Partial<UserAccount>>({});
  imagePreview = signal<string | null>(null);
  isInputFocused = signal<boolean>(false);

  readonly XIcon = X;
  readonly User = User;
  readonly Camera = Camera;
  readonly Upload = Upload;

  close = output<void>();
  userSaved = output<void>();

  ngOnInit() {
    if (this.editingUser()) {
      this.newUser.set({ ...this.editingUser()! });
      if (this.editingUser()?.image?.content) {
        this.imagePreview.set(this.editingUser()!.image!.content as string);
      }
    } else {
      this.newUser.set({ roleName: 'utilisateur' });
    }
  }

  saveUser() {
    const userToSave = { ...this.newUser() };

    if (this.editingUser()) {
      this.userService.updateUser(userToSave as UserAccount).subscribe(() => {
        this.userSaved.emit();
      });
    } else {
      this.userService.createUser(userToSave as UserAccount).subscribe(() => {
        this.userSaved.emit();
      });
    }
  }

  updateNewUser<K extends keyof UserAccount>(key: K, value: UserAccount[K]) {
    this.newUser.update((user) => ({ ...user, [key]: value }));
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        const content = reader.result as string;
        this.imagePreview.set(content);
        const image: UserImage = {
          content: content,
          fileName: file.name,
          fileType: file.type,
        };
        this.updateNewUser('image', image);
      };
      reader.readAsDataURL(file);
    }
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
