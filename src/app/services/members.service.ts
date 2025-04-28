import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Member } from '../models/member';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MembersService {

  members: Member[] = [
    {
      id: 1,
      name: 'Juan',
      lastName: 'Pérez',
      dni: '12345678',
      email: 'juan.perez@example.com',
      phone: '123-456-7890',
      address: 'Calle Falsa 123',
      birthdate: new Date('1990-05-15'),
      createdAt: new Date('2025-02-21'),
      status: 'active'
    },
    {
      id: 2,
      name: 'María',
      lastName: 'Gómez',
      dni: '23456789',
      email: 'maria.gomez@example.com',
      phone: '234-567-8901',
      address: 'Avenida Siempre Viva 742',
      birthdate: new Date('1985-09-30'),
      createdAt: new Date('2025-04-19'),
      status: 'inactive'
    },
    {
      id: 3,
      name: 'Carlos',
      lastName: 'Rodríguez',
      dni: '34567890',
      email: 'carlos.rodriguez@example.com',
      phone: '345-678-9012',
      address: 'Boulevard Principal 456',
      birthdate: new Date('1995-12-20'),
      createdAt: new Date('2024-03-28'),
      status: 'active'
    }
  ];


  apiUrl: string = 'http://localhost:8080/members'

  constructor(private http: HttpClient) {}

  getNoticias(): Observable<Member[]> {
    // Para desarrollo, devolvemos datos de ejemplo
    // En producción, descomentar la línea que hace la petición HTTP
    return of(this.members)
    // return this.http.get<Member[]>(this.apiUrl);
  }
}
