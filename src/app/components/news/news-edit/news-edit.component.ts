import { AfterViewInit, Component, EventEmitter, Inject, inject, Input, OnChanges, OnInit, Output, PLATFORM_ID, SimpleChanges } from '@angular/core';
import { CreateNews, News } from '../../../models/news';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NewsService } from '../../../services/news.service';
import { pastDateValidation } from '../../../validators/birthdate-validator';
import { isPlatformBrowser } from '@angular/common';

declare var bootstrap: any;

@Component({
  selector: 'app-news-edit',
  imports: [ReactiveFormsModule],
  templateUrl: './news-edit.component.html',
  styleUrl: './news-edit.component.css'
})
export class NewsEditComponent implements OnInit, OnChanges, AfterViewInit {

  @Input() selectedNews: News | null = null;
  @Output() newsUpdated = new EventEmitter<void>();

  newsForm: FormGroup;
  selectedFile: File | undefined = undefined;
  allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
  isLoading = false;
  
  // toast  
  private toastElement: any;
  private toast: any;

  newsService = inject(NewsService);

  constructor(
    private fb: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.newsForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      summary: ['', [Validators.required, Validators.minLength(5)]],
      content: ['', [Validators.required, Validators.minLength(10)]],
      date: ['', [Validators.required, pastDateValidation]]
    });
  }
  ngOnInit(): void {
    this.populateForm();
    
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        this.initializeToast();
      }, 100);
    }
  }

  private initializeToast() {
    if (!isPlatformBrowser(this.platformId)) return;

    this.toastElement = document.getElementById("responseToast");
    if (this.toastElement) {
      this.toast = new bootstrap.Toast(this.toastElement, {
        autohide: true,
        delay: 4000,
      });
    } else {
      console.error("Toast element not found");
    }
  }
  
  ngOnChanges(): void {
    this.populateForm();
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    } else {
      this.selectedFile = undefined;
    }
}
  
  onSubmit() {
    if (this.newsForm.invalid) return;

    const news: CreateNews = {
      title: this.newsForm.get('title')?.value,
      summary: this.newsForm.get('summary')?.value,
      content: this.newsForm.get('content')?.value,
      date: this.newsForm.get('date')?.value,
    };

    if(!!this.selectedFile) {
      if (this.selectedFile.type && !this.allowedImageTypes.includes(this.selectedFile.type)) {
        this.showToast("Debes seleccionar un archivo de imagen válido (.jpg, .jpeg, .png)", 'error');
        return;
      }
    }

    this.showToast('Actualizando noticia...', 'loading');

    this.newsService.updateNews(this.selectedNews!.id, news, this.selectedFile).subscribe({
      next: () => {
        this.showToast("Noticia actualizada con éxito", 'success');
        this.closeModal();
        this.newsUpdated.emit();
      },
      error: (err) => {
        console.error('Error:', err);
        this.showToast("Error al actualizar la noticia", 'error');
      }
    });
  }

  private closeModal(): void {
    const modalElement = document.getElementById('editNewsModal');
    if (modalElement) {
      const modalInstance = bootstrap.Modal.getInstance(modalElement);
      modalInstance?.hide();
    }
  }

  populateForm() {
    if(this.selectedNews) {
      this.newsForm.patchValue({
        title: this.selectedNews.title,
        summary: this.selectedNews.summary,
        content: this.selectedNews.content,
        date: this.formatDateForInput(this.selectedNews.date)
      })
    }
  }

  formatDateForInput(dateInput: string | number | Date): string {
    const date = new Date(dateInput); // timestamp -> Date
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }



  // Método para mostrar toast
  private showToast(message: string, type: 'success' | 'error' | 'loading'): void {
    
    if (!isPlatformBrowser(this.platformId)) return;

    const toastBody = document.getElementById('toastBody');
    const toastIcon = document.getElementById('toastIcon');
    const toastContainer = document.getElementById('responseToast');
    
    if (toastBody && toastIcon && toastContainer) {
      // Configurar el mensaje
      toastBody.textContent = message;
      
      // Configurar el estilo según el tipo
      switch (type) {
        case 'success':
          toastContainer.className = 'toast align-items-center text-bg-success border-0';
          toastIcon.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle-fill" viewBox="0 0 16 16">
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.061L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z"/>
            </svg>
          `;
          break;

        case 'error':
          toastContainer.className = 'toast align-items-center text-bg-danger border-0';
          toastIcon.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-triangle-fill" viewBox="0 0 16 16">
              <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z"/>
            </svg>
          `;
          break;

        case 'loading':
          toastContainer.className = 'toast align-items-center text-bg-secondary border-0';
          toastIcon.innerHTML = `
            <div class="spinner-border spinner-border-sm text-light" role="status">
              <span class="visually-hidden">Loading...</span>
            </div>
          `;
          break;

        default:
          toastContainer.className = 'toast align-items-center text-bg-info border-0';
          toastIcon.innerHTML = '';
          break;
      }
      
      // Mostrar el toast
      this.toast.show();
    }
  }

}
