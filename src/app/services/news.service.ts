import { Injectable } from '@angular/core';
import { CreateNews, News } from '../models/news';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NewsService {

  // Datos de ejemplo para desarrollo
  private noticiasEjemplo: News[] = [
    {
      id: 1,
      title: "Gran victoria del equipo principal",
      content: "El equipo principal logró una importante victoria en el torneo regional...",
      summary: "Victoria clave en el torneo regional",
      imageUrl: "https://picsum.photos/300/200",
      date: new Date("2023-01-10"),
      authorId: 1,
    },
    {
      id: 2,
      title: "Nuevas instalaciones para el club",
      content: "El club inauguró nuevas instalaciones que incluyen...",
      summary: "Inauguración de nuevas instalaciones deportivas",
      imageUrl: "https://picsum.photos/300/200",
      date: new Date("2023-01-05"),
      authorId: 2,
    },
    {
      id: 3,
      title: "Comienza la temporada de verano",
      content: "Este fin de semana comienza la temporada de verano con actividades...",
      summary: "Inicio de la temporada de verano con múltiples actividades",
      imageUrl: "https://picsum.photos/300/200",
      date: new Date("2023-01-01"),
      authorId: 1,
    },
  ]

  apiUrl: string = 'http://localhost:8080/news'

  constructor(private http: HttpClient) {}


  getNews(): Observable<News[]> {
      // Para desarrollo, devolvemos datos de ejemplo
      // En producción, descomentar la línea que hace la petición HTTP
      // return of(this.members)
  
      return this.http.get<News[]>(this.apiUrl);
    }

      getLastNews(): Observable<News[]> {
      // Para desarrollo, devolvemos datos de ejemplo
      // En producción, descomentar la línea que hace la petición HTTP
      // return of(this.members)
  
      return this.http.get<News[]>(this.apiUrl + "/last-news");
    }
  
    getNewsById(id: number): Observable<News> {
      
      return this.http.get<News>(this.apiUrl + "/" + id);
    }

  createNews(newsData: CreateNews, imageFile: File): Observable<string> {
  const formData = new FormData();

  formData.append('title', newsData.title);
  formData.append('summary', newsData.summary);
  formData.append('content', newsData.content);
  formData.append('date', newsData.date.toString());
  formData.append('image', imageFile); // nombre debe coincidir con @RequestParam("image")

  return this.http.post(this.apiUrl + '/create', formData, {
    responseType: 'text' // porque estás devolviendo un ResponseEntity<String>
  });
}

  updateNews(id: any, newsData: News): Observable<News | null> {
    /*     
    const headers = new HttpHeaders({
      'x-user-id': this.sessionService.getItem('user').id.toString(),
    });
    */
    return this.http.put<News>(this.apiUrl + `/${id}`, newsData);
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
