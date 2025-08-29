import { Component, OnInit, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ConfigurationService } from '../../../configuration.service';
import { LucideAngularModule, LoaderCircle } from 'lucide-angular';
import { KeyboardService } from '../../../keyboard.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-company-settings',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, LucideAngularModule],
  templateUrl: './company-settings.html',
})
export class CompanySettingsComponent implements OnInit {
  readonly Loader = LoaderCircle;

  private fb = inject(FormBuilder);
  private configurationService = inject(ConfigurationService);
  private keyboardService = inject(KeyboardService);

  form: FormGroup;
  logoUrl: string | ArrayBuffer | null = null;
  cachetUrl: string | ArrayBuffer | null = null;
  pdfConfiguration: any = null;
  areImagesLoading = false;
  isFormLoading = false;
  isInputFocused = signal<boolean>(false);

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
    this.loadData();
  }

  loadData() {
    this.isFormLoading = true;
    this.configurationService.getPdfOptions().subscribe({
      next: (pdfOptions) => {
        // Process PDF options
        let options;
        if (typeof pdfOptions === 'string') {
          try {
            options = JSON.parse(pdfOptions);
          } catch (e) {
            console.error('Error parsing PDF options JSON string:', e);
          }
        } else {
          options = pdfOptions;
        }
        if (options && options.header) {
          this.form.patchValue(options.header);
        }
        this.isFormLoading = false;
      },
      error: (err) => {
        console.error('Error loading company settings:', err);
        this.isFormLoading = false;
        alert('Erreur lors du chargement des informations.');
      },
    });

    this.areImagesLoading = true;
    this.configurationService.getInvoiceConfiguration().subscribe({
      next: (invoiceConfig) => {
        // Process invoice config for logo
        this.pdfConfiguration = invoiceConfig;
        if (invoiceConfig && invoiceConfig.images) {
          if (invoiceConfig.images.logo) {
            this.logoUrl = invoiceConfig.images.logo;
          }
          if (invoiceConfig.images.cachet) {
            this.cachetUrl = invoiceConfig.images.cachet;
          }
        }
        this.areImagesLoading = false;
      },
      error: (err) => {
        console.error('Error loading company settings:', err);
        this.areImagesLoading = false;
        alert('Erreur lors du chargement des informations.');
      },
    });
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.logoUrl = reader.result;
        if (!this.pdfConfiguration) this.pdfConfiguration = {};
        if (!this.pdfConfiguration.images) this.pdfConfiguration.images = {};
        this.pdfConfiguration.images.logo = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onCachetSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        this.cachetUrl = reader.result;
        if (!this.pdfConfiguration) this.pdfConfiguration = {};
        if (!this.pdfConfiguration.images) this.pdfConfiguration.images = {};
        this.pdfConfiguration.images.cachet = reader.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit() {
    if (this.form.valid) {
      this.isFormLoading = true;
      const payload = {
        header: this.form.value,
        images: null,
      };
      this.configurationService
        .updatePdfOptions(JSON.stringify(payload))
        .subscribe({
          next: () => {
            this.isFormLoading = false;
            if (this.pdfConfiguration) {
              this.areImagesLoading = true;
              this.configurationService
                .updateAllPdfOptions(this.pdfConfiguration)
                .subscribe({
                  next: () => {
                    this.areImagesLoading = false;
                    this.loadData(); // Refresh data
                  },
                  error: (err) => {
                    this.areImagesLoading = false;
                    console.error('Error updating all PDF options:', err);
                    alert('Erreur lors de la mise à jour du logo.');
                  },
                });
            } else {
              this.loadData(); // Refresh data
            }
          },
          error: (err) => {
            this.isFormLoading = false;
            console.error('Error updating PDF options:', err);
            alert('Erreur lors de la mise à jour des informations.');
          },
        });
    }
  }
  openKeyboard(): void {
    this.keyboardService.openOnScreenKeyboard();
  }

  closeKeyboard(): void {
    this.keyboardService.closeOnScreenKeyboard();
  }
}