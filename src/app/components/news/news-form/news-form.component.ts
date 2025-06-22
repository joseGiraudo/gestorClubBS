import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { NewsService } from '../../../services/news.service';
import { CreateNews, News } from '../../../models/news';
import { pastDateValidation } from '../../../validators/birthdate-validator';
import { Router } from '@angular/router';

declare var bootstrap: any;

@Component({
  selector: 'app-news-form',
  imports: [ReactiveFormsModule],
  templateUrl: './news-form.component.html',
  styleUrl: './news-form.component.css'
})
export class NewsFormComponent implements OnInit {

  newsForm: FormGroup;
  selectedFile: File | null = null;

  allowedImageTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];

  // toast  
  private toastElement: any;
  private toast: any;

  private newsService = inject(NewsService);
  private router = inject(Router);

  constructor(private fb: FormBuilder) {

    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0]; // 'YYYY-MM-DD'

    this.newsForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(5)]],
      summary: ['', [Validators.required, Validators.minLength(5)]],
      content: ['', [Validators.required, Validators.minLength(10)]],
      date: [formattedDate, [Validators.required, pastDateValidation]]
    });
  }

  ngOnInit(): void {
    // Inicializar el toast
    this.toastElement = document.getElementById('responseToast');
    if (this.toastElement) {
      this.toast = new bootstrap.Toast(this.toastElement, {
        autohide: true,
        delay: 4000 // 4 segundos
      });
    }
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onSubmit() {
    if (this.newsForm.invalid) return;

    console.log(this.selectedFile);

    const news: CreateNews = {
      title: this.newsForm.get('title')?.value,
      summary: this.newsForm.get('summary')?.value,
      content: this.newsForm.get('content')?.value,
      date: this.newsForm.get('date')?.value,
    };

    if (this.selectedFile) {
      if(this.selectedFile.type && this.allowedImageTypes.includes(this.selectedFile.type) ) {
        
        this.showToast('Cargando noticia', 'loading');
        this.newsService.createNews(news, this.selectedFile).subscribe({
          next: (res) => {
            this.showToast("Noticia cargada con éxito", 'success')
            this.router.navigate(['/news']);
          },
          error: (err) => {
            console.error('Error:', err);
            this.showToast("Error al cargar la noticia", 'error')
          }
        });
      } else {
        this.showToast("Debes seleccionar un archivo de imagen (.jpg .jpeg .png)", 'error')
      }
    }
  }



  // Método para mostrar toast
  private showToast(message: string, type: 'success' | 'error' | 'loading'): void {
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
