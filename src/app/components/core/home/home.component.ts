import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { News } from '../../../models/news';
import { NewsService } from '../../../services/news.service';
import { NewsListComponent } from "../../news/news-list/news-list.component";

@Component({
  selector: 'app-home',
  imports: [RouterLink, NewsListComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {

  private newsService = inject(NewsService);

  newsArray: News[] = []

  

  ngOnInit(): void {
    this.newsService.getNoticias().subscribe((noticias) => {
      this.newsArray = noticias
    })
  }

}
