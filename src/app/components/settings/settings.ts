import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-settings',
  imports: [RouterLink],
  templateUrl: './settings.html',
})
export class SettingsComponent {}
