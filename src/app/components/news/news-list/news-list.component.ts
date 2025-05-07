import { Component, inject, OnInit } from '@angular/core';
import { NewsService } from '../../../services/news.service';
import { News } from '../../../models/news';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-news-list',
  imports: [RouterLink],
  templateUrl: './news-list.component.html',
  styleUrl: './news-list.component.css'
})
export class NewsListComponent implements OnInit {

  private newsService = inject(NewsService);

  newsArray: News[] = []

  

  ngOnInit(): void {
    this.newsService.getNews().subscribe((news) => {
      this.newsArray = news
    })
  }
}
