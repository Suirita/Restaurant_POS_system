
import { Injectable } from '@angular/core';

declare global {
  interface Window {
    electron: {
      openKeyboard: () => void;
    };
  }
}

@Injectable({
  providedIn: 'root'
})
export class KeyboardService {
  openOnScreenKeyboard() {
    if (window.electron) {
      window.electron.openKeyboard();
    } else {
      console.warn('Electron context not available.');
    }
  }
}
