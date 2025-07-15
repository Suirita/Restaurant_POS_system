import { Component, OnInit, inject, signal } from '@angular/core';
import { KeyboardService } from '../../../keyboard.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../category.service';
import { Category } from '../../../types/pos.types';
import { LucideAngularModule, Edit, Trash2 } from 'lucide-angular';
import { HttpClient } from '@angular/common/http';
import { switchMap } from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-categories-settings',
  imports: [CommonModule, FormsModule, LucideAngularModule],
  templateUrl: './categories-settings.html',
})
export class CategoriesSettingsComponent implements OnInit {
  readonly edit = Edit;
  readonly trash2 = Trash2;

  private categoryService = inject(CategoryService);
  private http = inject(HttpClient);
  private keyboardService = inject(KeyboardService);

  categories = signal<Category[]>([]);
  categoryImages = signal<{ [key: string]: string }>({});
  showCategoryForm = signal<boolean>(false);
  editingCategory = signal<Category | null>(null);

  newCategoryLabel: string = '';
  newCategoryImage: File | null = null;

  ngOnInit(): void {
    this.loadCategories();
    this.loadCategoryImages();
  }

  loadCategoryImages() {
    this.http
      .get<{ [key: string]: string }>('/assets/category-images.json')
      .subscribe((data) => {
        this.categoryImages.set(data);
      });
  }

  loadCategories(): void {
    const user = JSON.parse(localStorage.getItem('user')!);
    this.categoryService.getCategories(user.token).subscribe((categories) => {
      this.categories.set(categories);
    });
  }

  openCreateForm(): void {
    this.editingCategory.set(null);
    this.newCategoryLabel = '';
    this.newCategoryImage = null;
    this.showCategoryForm.set(true);
  }

  openEditForm(category: Category): void {
    this.editingCategory.set(category);
    this.newCategoryLabel = category.label; // Populate form with existing category label
    this.newCategoryImage = null;
    this.showCategoryForm.set(true);
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.newCategoryImage = input.files[0];
    }
  }

  saveCategory(): void {
    const user = JSON.parse(localStorage.getItem('user')!);
    if (this.editingCategory()) {
      // Update existing category
      const updatedCategory: Category = {
        ...this.editingCategory()!,
        label: this.newCategoryLabel,
      };
      this.categoryService
        .updateCategory(updatedCategory, user.token)
        .subscribe(() => {
          this.loadCategories();
          this.showCategoryForm.set(false);
        });
    } else {
      // Create new category
      this.categoryService
        .createCategory(this.newCategoryLabel, user.token)
        .subscribe(() => {
          if (this.newCategoryImage) {
            const reader = new FileReader();
            reader.onload = (e: any) => {
              const imageContent = e.target.result;
              this.http
                .post('http://localhost:3000/api/save-image', {
                  path: `src/assets/img/${this.newCategoryLabel}.jpeg`,
                  content: imageContent.split(',')[1],
                })
                .pipe(
                  switchMap(() => {
                    const currentImages = this.categoryImages();
                    currentImages[this.newCategoryLabel] =
                      `assets/img/${this.newCategoryLabel}.jpeg`;
                    return this.http.post(
                      'http://localhost:3000/api/update-json',
                      {
                        path: 'src/assets/category-images.json',
                        content: currentImages,
                      }
                    );
                  })
                )
                .subscribe({
                  next: () => {
                    this.loadCategories();
                    this.loadCategoryImages();
                    this.showCategoryForm.set(false);
                  },
                  error: (err) => {
                    console.error('Error during save process:', err);
                  },
                });
            };
            reader.readAsDataURL(this.newCategoryImage);
          } else {
            this.loadCategories();
            this.showCategoryForm.set(false);
          }
        });
    }
  }

  deleteCategory(categoryId: string): void {
    const user = JSON.parse(localStorage.getItem('user')!);
    if (confirm('Êtes-vous sûr de vouloir supprimer cette catégorie ?')) {
      const categoryToDelete = this.categories().find(c => c.id === categoryId);
      if (categoryToDelete) {
        const imagePath = this.categoryImages()[categoryToDelete.label];
        // Prepend 'src/' to the path for the backend
        const backendImagePath = 'src/' + imagePath; 
        this.http.post('http://localhost:3000/api/delete-image', { path: backendImagePath })
          .pipe(
            switchMap(() => {
              const updatedImages = { ...this.categoryImages() };
              delete updatedImages[categoryToDelete.label];
              return this.http.post('http://localhost:3000/api/update-json', {
                path: 'src/assets/category-images.json',
                content: updatedImages,
              });
            }),
            switchMap(() => this.categoryService.deleteCategory(categoryId, user.token))
          )
          .subscribe({
            next: () => {
              this.loadCategories();
              this.loadCategoryImages();
            },
            error: (err) => console.error('Error deleting category:', err),
          });
      }
    }
  }

  cancelForm(): void {
    this.showCategoryForm.set(false);
    this.editingCategory.set(null);
  }

  openKeyboard(): void {
    this.keyboardService.openOnScreenKeyboard();
  }
}