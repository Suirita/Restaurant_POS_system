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
  logoUrl: string | ArrayBuffer | null = null;
  pdfConfiguration: any = null;

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

  ngOnInit() {
    this.getPdfOptions();
    this.getLogo();
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

  getLogo() {
    this.configurationService.getInvoiceConfiguration().subscribe((data) => {
      this.pdfConfiguration = data;
      if (data && data.images && data.images.logo) {
        this.logoUrl = data.images.logo;
      }
    });
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.logoUrl = reader.result;
        if (this.pdfConfiguration && this.pdfConfiguration.images) {
          this.pdfConfiguration.images.logo = reader.result as string;
        }
      };
      reader.readAsDataURL(file);
    }
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
            if (this.pdfConfiguration) {
              this.configurationService
                .updateAllPdfOptions(this.pdfConfiguration)
                .subscribe({
                  next: () => {
                    this.getLogo();
                    alert('Informations et logo mis à jour avec succès.');
                  },
                  error: (err) => {
                    console.error('Error updating all PDF options:', err);
                    alert('Erreur lors de la mise à jour du logo.');
                  },
                });
            } else {
              alert("Informations de l'entreprise mises à jour avec succès.");
            }
          },
          error: (err) => {
            console.error('Error updating PDF options:', err);
            alert('Erreur lors de la mise à jour des informations.');
          },
        });
    }
  }
}
