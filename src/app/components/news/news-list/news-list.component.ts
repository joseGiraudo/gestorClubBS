import { Component, inject, OnInit } from '@angular/core';
import { NewsService } from '../../../services/news.service';
import { News } from '../../../models/news';
import { Router } from '@angular/router';

@Component({
  selector: 'app-news-list',
  imports: [],
  templateUrl: './news-list.component.html',
  styleUrl: './news-list.component.css'
})
export class NewsListComponent implements OnInit {

  private newsService = inject(NewsService);

  newsArray: News[] = [];
  loading = true;

  constructor(
    private router: Router
  )
  {}
  

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
