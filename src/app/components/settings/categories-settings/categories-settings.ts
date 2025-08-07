import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { KeyboardService } from '../../../keyboard.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryService } from '../../../category.service';
import { Category } from '../../../types/pos.types';
import {
  LucideAngularModule,
  Edit,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-angular';
import { HttpClient } from '@angular/common/http';
import { ReusableTable } from '../../reusable-table/reusable-table';

@Component({
  standalone: true,
  selector: 'app-categories-settings',
  imports: [CommonModule, FormsModule, LucideAngularModule, ReusableTable],
  templateUrl: './categories-settings.html',
})
export class CategoriesSettingsComponent implements OnInit {
  readonly edit = Edit;
  readonly trash2 = Trash2;
  readonly ChevronLeftIcon = ChevronLeft;
  readonly ChevronRightIcon = ChevronRight;
  readonly XIcon = X;

  private categoryService = inject(CategoryService);
  private http = inject(HttpClient);
  private keyboardService = inject(KeyboardService);

  categories = signal<Category[]>([]);
  categoryImages = signal<{ [key: string]: string }>({});
  showCategoryForm = signal<boolean>(false);
  editingCategory = signal<Category | null>(null);
  isInputFocused = signal<boolean>(false);

  newCategoryLabel: string = '';
  newCategoryImage: File | null = null;

  // Filtering and Search
  searchTerm = signal<string>('');
  filteredCategories = computed(() => {
    const term = this.searchTerm().toLowerCase();
    return this.categories().filter((category) =>
      category.label.toLowerCase().includes(term)
    );
  });

  // Pagination
  currentPage = signal<number>(1);
  totalPages = computed(() => Math.ceil(this.filteredCategories().length / 10));
  paginatedCategories = computed(() => {
    const startIndex = (this.currentPage() - 1) * 10;
    const endIndex = startIndex + 10;
    const images = this.categoryImages();
    return this.filteredCategories()
      .slice(startIndex, endIndex)
      .map((category) => ({
        ...category,
        image: images[category.label] || 'https://placehold.co/1280x720',
      }));
  });
  pages = computed(() => {
    const total = this.totalPages();
    const current = this.currentPage();
    const maxVisible = 5;
    let start = Math.max(1, current - 2);
    let end = Math.min(total, start + maxVisible - 1);

    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1);
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
  });

  tableColumns = ['Image', 'Nom'];
  tableColumnKeys = ['image', 'label'];

  ngOnInit(): void {
    this.loadCategories();
    this.loadCategoryImages();
  }

  loadCategoryImages() {
    this.http
      .get<{ [key: string]: string }>('assets/category-images.json')
      .subscribe((data) => {
        this.categoryImages.set(data);
      });
  }

  loadCategories(): void {
    const user = JSON.parse(localStorage.getItem('user')!);
    this.categoryService.getCategories(user.token).subscribe((categories) => {
      this.categories.set(categories);
      this.goToPage(1); // Reset to first page
    });
  }

  onSearchTermChange(event: Event): void {
    const term = (event.target as HTMLInputElement).value;
    this.searchTerm.set(term);
    this.goToPage(1);
  }

  goToPage(page: number): void {
    if (page < 1 || page > this.totalPages()) return;
    this.currentPage.set(page);
  }

  nextPage(): void {
    this.goToPage(this.currentPage() + 1);
  }

  previousPage(): void {
    this.goToPage(this.currentPage() - 1);
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
              if (window.api) {
                window.api
                  .saveImage({
                    path: `${this.newCategoryLabel}.jpeg`,
                    content: imageContent.split(',')[1],
                  })
                  .then(() => {
                    const currentImages = this.categoryImages();
                    currentImages[
                      this.newCategoryLabel
                    ] = `assets/img/${this.newCategoryLabel}.jpeg`;
                    return window.api.updateJson({
                      path: 'category-images.json',
                      content: currentImages,
                    });
                  })
                  .then(() => {
                    this.loadCategories();
                    this.loadCategoryImages();
                    this.showCategoryForm.set(false);
                  })
                  .catch((err: any) => {
                    console.error('Error during save process:', err);
                  });
              } else {
                console.error('Electron API not available for saving image.');
              }
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
      const categoryToDelete = this.categories().find(
        (c) => c.id === categoryId
      );
      if (categoryToDelete) {
        const imagePath = this.categoryImages()[categoryToDelete.label];
        if (imagePath) {
          const filename = imagePath.split('/').pop();
          if (window.api && filename) {
            window.api
              .deleteImage({ path: filename })
              .then(() => {
                const updatedImages = { ...this.categoryImages() };
                delete updatedImages[categoryToDelete.label];
                return window.api.updateJson({
                  path: 'category-images.json',
                  content: updatedImages,
                });
              })
              .then(() =>
                this.categoryService
                  .deleteCategory(categoryId, user.token)
                  .toPromise()
              )
              .then(() => {
                this.loadCategories();
                this.loadCategoryImages();
              })
              .catch((err: any) =>
                console.error('Error deleting category:', err)
              );
          } else {
            console.error(
              'Electron API not available or filename not found for deleting image.'
            );
          }
        } else {
          this.categoryService
            .deleteCategory(categoryId, user.token)
            .subscribe({
              next: () => {
                this.loadCategories();
              },
              error: (err) => console.error('Error deleting category:', err),
            });
        }
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

  closeKeyboard(): void {
    this.keyboardService.closeOnScreenKeyboard();
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'https://placehold.co/1280x720';
  }
}
