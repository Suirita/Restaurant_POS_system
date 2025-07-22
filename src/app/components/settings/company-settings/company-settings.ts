import { Component, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ConfigurationService } from '../../../configuration.service';

@Component({
  selector: 'app-company-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './company-settings.html',
})
export class CompanySettingsComponent implements OnInit {
  private fb = inject(FormBuilder);
  private configurationService = inject(ConfigurationService);

  form: FormGroup;

  constructor() {
    this.form = this.fb.group({
      companyName: [''],
      email: [''],
      phoneNumber: [''],
      website: [''],
      address: this.fb.group({
        street: [''],
        city: [''],
        postalCode: [''],
        countryCode: [''],
      }),
    });
  }

  getPdfOptions() {
    this.configurationService.getPdfOptions().subscribe((data) => {
      let options;
      if (typeof data === 'string') {
        try {
          options = JSON.parse(data);
        } catch (e) {
          console.error('Error parsing PDF options JSON string:', e);
          return;
        }
      } else {
        options = data;
      }

      if (options && options.header) {
        this.form.patchValue(options.header);
      }
    });
  }

  ngOnInit() {
    this.getPdfOptions();
  }

  onSubmit() {
    if (this.form.valid) {
      const payload = {
        header: this.form.value,
        images: null,
      };
      this.configurationService
        .updatePdfOptions(JSON.stringify(payload))
        .subscribe({
          next: () => {
            this.getPdfOptions();
          },
          error: (err) => {
            console.error('Error updating PDF options:', err);
            alert('Erreur lors de la mise à jour des informations.');
          },
        });
    }
  }
}
