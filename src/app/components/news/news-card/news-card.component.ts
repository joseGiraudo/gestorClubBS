import { Component, inject, OnInit } from '@angular/core';
import { News } from '../../../models/news';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { NewsService } from '../../../services/news.service';
import { response } from 'express';

@Component({
  selector: 'app-news-card',
  imports: [RouterLink],
  templateUrl: './news-card.component.html',
  styleUrl: './news-card.component.css'
})
export class NewsCardComponent implements OnInit {

  private newsService = inject(NewsService);

  id: string | null = null;

  constructor(private activatedRoute: ActivatedRoute) {}

  news: News = {
    id: 0,
    title: 'Titulo',
    content: 'Contenido',
    summary: 'Resumen',
    imageUrl: 'url ejemplo',
    date: new Date('28/04/2000'),
    authorId: 1
  }

  ngOnInit() {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');

    if(this.id) {
      this.newsService.getNoticia(parseInt(this.id)).subscribe({
        next:(response: News) => {
          this.news = response;
        },
        error: (error) => {
          console.error("Error al obtener la noticia:", error);
        }
      });
    }

  }

}
