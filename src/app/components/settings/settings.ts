import { Component } from '@angular/core';
import { RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'app-settings',
  imports: [RouterLink, CommonModule, RouterOutlet, RouterLinkActive],
  templateUrl: './settings.html',
})
export class SettingsComponent {}
