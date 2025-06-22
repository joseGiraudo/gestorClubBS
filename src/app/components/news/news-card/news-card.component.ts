import { Component, inject, OnInit } from '@angular/core';
import { News } from '../../../models/news';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { NewsService } from '../../../services/news.service';

@Component({
  selector: 'app-news-card',
  imports: [],
  templateUrl: './news-card.component.html',
  styleUrl: './news-card.component.css'
})
export class NewsCardComponent implements OnInit {

  private newsService = inject(NewsService);

  id: string | null = null;
  news: News | null = null;
  loading = true;
  notFound = false;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {}

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');

    if(this.id) {
      this.loadNews(parseInt(this.id));
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
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/news']);
  }

  formatDate(date: Date): string {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(date);
  }

  formatContent(content: string): string[] {
    const cleanContent = content.replace(/\\n/g, '\n'); // convierte "\n" literal en salto real
    return cleanContent.split(/\r?\n/).filter(p => p.trim().length > 0);
  }

}
