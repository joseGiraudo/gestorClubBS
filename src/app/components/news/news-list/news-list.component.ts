import { Component, inject, OnInit } from '@angular/core';
import { NewsService } from '../../../services/news.service';
import { News } from '../../../models/news';
import { Router, RouterLink } from '@angular/router';
import { map, Observable } from 'rxjs';
import { User } from '../../../models/user';
import { LoginService } from '../../../services/login.service';

@Component({
  selector: 'app-news-list',
  imports: [RouterLink],
  templateUrl: './news-list.component.html',
  styleUrl: './news-list.component.css'
})
export class NewsListComponent implements OnInit {

  isLoggedIn$: Observable<boolean>;
  user$: Observable<User | null>;


  private newsService = inject(NewsService);
  private loginService = inject(LoginService);

  newsArray: News[] = [];
  loading = true;

  constructor(private router: Router)
  {
    this.isLoggedIn$ = this.loginService.currentUser$.pipe(
      // Mapeamos para saber si hay usuario
      map(user => !!user)
    );
    this.user$ = this.loginService.currentUser$;
  }

  hasAnyRole(roles: string[]): boolean {
    return this.loginService.hasAnyRole(roles);
  }
  
  // Método para verificar roles (opcional)
  hasRole(role: string): boolean {
    return this.loginService.hasRole(role);
  }
  

  ngOnInit(): void {
    this.newsService.getNews().subscribe({
      next: (data) => {
        this.newsArray = data;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading news:', error);
        this.loading = false;
      }
    });
  }

  viewNews(id: number): void {
    this.router.navigate(['/news', id]);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  }

}
