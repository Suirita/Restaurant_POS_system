
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class KeyboardService {
  openOnScreenKeyboard() {
    if (window.api && window.api.openKeyboard) {
      window.api.openKeyboard();
    } else {
      console.warn('Electron context not available.');
    }
  }
}
