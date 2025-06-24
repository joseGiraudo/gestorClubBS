import { Injectable } from '@angular/core';
import { CreateNews, News } from '../models/news';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  apiUrl: string = 'http://localhost:8080/news';

  constructor(private http: HttpClient) {}

  getNews(): Observable<News[]> {
    return this.http.get<News[]>(this.apiUrl);
  }

  getLastNews(): Observable<News[]> {
    return this.http.get<News[]>(this.apiUrl + '/last-news');
  }

  getNewsById(id: number): Observable<News> {
    return this.http.get<News>(this.apiUrl + '/' + id);
  }

  createNews(newsData: CreateNews, imageFile: File): Observable<any> {
    const formData = new FormData();

    formData.append('title', newsData.title);
    formData.append('summary', newsData.summary);
    formData.append('content', newsData.content);
    formData.append('date', newsData.date.toString());
    formData.append('image', imageFile); // nombre debe coincidir con @RequestParam("image")

    return this.http.post(this.apiUrl + '/create', formData);
  }

  updateNews(
    id: number,
    newsData: CreateNews,
    imageFile?: File
  ): Observable<any> {
    const formData = new FormData();

    formData.append('title', newsData.title);
    formData.append('summary', newsData.summary);
    formData.append('content', newsData.content);
    formData.append('date', newsData.date.toString());

    // Solo si el usuario cambió la imagen
    if (imageFile) {
      formData.append('image', imageFile);
    }

    return this.http.put(`${this.apiUrl}/${id}`, formData);
  }

  deleteNews(id: any) {
    /*     
    const headers = new HttpHeaders({
      'x-user-id': this.sessionService.getItem('user').id.toString(),
    });
    */
    return this.http.delete<News>(this.apiUrl + `/${id}`);
  }
}
