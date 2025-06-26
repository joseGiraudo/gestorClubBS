import { AfterViewInit, Component, Inject, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { News } from '../../../models/news';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NewsService } from '../../../services/news.service';
import { LoginService } from '../../../services/login.service';
import { map, Observable } from 'rxjs';
import { User } from '../../../models/user';
import { NewsEditComponent } from '../news-edit/news-edit.component';
import { isPlatformBrowser } from '@angular/common';

declare var bootstrap: any;

@Component({
  selector: 'app-news-card',
  imports: [NewsEditComponent],
  templateUrl: './news-card.component.html',
  styleUrl: './news-card.component.css',
})
export class NewsCardComponent implements OnInit, AfterViewInit {
  private newsService = inject(NewsService);

  id: string | null = null;
  news: News | null = null;
  loading = true;
  notFound = false;

  // modal de confirmacion
  private modal: any;
  modalMessage: string = '¿Seguro quieres realizar la acción?';
  modalTitle: string = 'Confirmar';

  // toast  
  private toastElement: any;
  private toast: any;

  isLoggedIn$: Observable<boolean>;
  user$: Observable<User | null>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private loginService: LoginService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isLoggedIn$ = this.loginService.currentUser$.pipe(
      // Mapeamos para saber si hay usuario
      map((user) => !!user)
    );
    this.user$ = this.loginService.currentUser$;
  }

  hasAnyRole(roles: string[]): boolean {
    return this.loginService.hasAnyRole(roles);
  }

  logout() {
    this.loginService.logout();
  }

  // Método para verificar roles (opcional)
  hasRole(role: string): boolean {
    return this.loginService.hasRole(role);
  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    if (this.id) {
      this.loadNews(parseInt(this.id));
    }
  }

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      const modalElement = document.getElementById('confirmModal');
      if (modalElement) {
        this.modal = new bootstrap.Modal(modalElement);
      }

      // Toast con delay por si todavía no se montó
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

  loadNews(id: number): void {
    this.newsService.getNewsById(id).subscribe({
      next: (data) => {
        if (data) {
          this.news = data;
        } else {
          this.notFound = true;
        }
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading news:', error);
        this.notFound = true;
        this.loading = false;
      },
    });
  }

  onNewsUpdated() {
    if (this.news?.id) {
      this.loadNews(this.news.id);
    }
  }
  
  deleteNews(news: News) {
    this.newsService.deleteNews(news.id).subscribe({
      next: () => {
        console.log("Noticia eliminada");
        this.showToast('Noticia eliminada', 'success')
        this.onNewsUpdated();
      },
      error: (err) => {
        console.error("Error al eliminar la noticia:", err);
        this.showToast('Error al eliminar la noticia', 'error')
      }
    });
  }

  // modal de confirmacion
  openDeleteModal() {
    this.modalTitle = 'Confirmación';
    this.modalMessage = `¿Seuro desea eliminar la noticia? No podrá recuperarla luego.`
    this.modal.show();
  }

  modalConfirm(): void {
    console.log("Confirmo el modal");
    
    console.log(this.news);
    if(this.news) {
      this.deleteNews(this.news)
    }

    // Limpiar estado y cerrar el modal
    this.modal.hide();
  }


  goBack(): void {
    this.router.navigate(['/news']);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(date);
  }

  formatContent(content: string): string[] {
    const cleanContent = content.replace(/\\n/g, '\n'); // convierte "\n" literal en salto real
    return cleanContent.split(/\r?\n/).filter((p) => p.trim().length > 0);
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
