import { Injectable } from '@angular/core';
import { News } from '../models/news';
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

  constructor() {}

  getNoticias(): Observable<News[]> {
    // Para desarrollo, devolvemos datos de ejemplo
    // En producción, descomentar la línea que hace la petición HTTP
    return of(this.noticiasEjemplo)
    // return this.http.get<Noticia[]>(this.apiUrl);
  }

  getNoticia(id: number): Observable<News> {
    // Para desarrollo
    const noticia = this.noticiasEjemplo.find((n) => n.id === id)
    return of(noticia as News)
    // En producción
    // return this.http.get<Noticia>(`${this.apiUrl}/${id}`);
  }

  crearNoticia(noticia: Omit<News, "id">): Observable<News> {
    // En producción
    // return this.http.post<Noticia>(this.apiUrl, noticia);

    // Para desarrollo (simulación)
    const nuevaNoticia: News = {
      ...noticia,
      id: this.noticiasEjemplo.length + 1,
    }
    this.noticiasEjemplo.push(nuevaNoticia)
    return of(nuevaNoticia)
  }

  actualizarNoticia(id: number, noticia: Partial<News>): Observable<News> {
    // En producción
    // return this.http.put<Noticia>(`${this.apiUrl}/${id}`, noticia);

    // Para desarrollo (simulación)
    const index = this.noticiasEjemplo.findIndex((n) => n.id === id)
    if (index !== -1) {
      this.noticiasEjemplo[index] = { ...this.noticiasEjemplo[index], ...noticia }
      return of(this.noticiasEjemplo[index])
    }
    throw new Error("Noticia no encontrada")
  }

  eliminarNoticia(id: number): Observable<void> {
    // En producción
    // return this.http.delete<void>(`${this.apiUrl}/${id}`);

    // Para desarrollo (simulación)
    const index = this.noticiasEjemplo.findIndex((n) => n.id === id)
    if (index !== -1) {
      this.noticiasEjemplo.splice(index, 1)
      return of(void 0)
    }
    throw new Error("Noticia no encontrada")
  }
}
