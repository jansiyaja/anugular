import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root' // ✅ Angular 20 uses this for global singleton services
})
export class ApiService {
  private base = '/api'; // ✅ SSR safe: calls go to server.ts backend

  constructor(private http: HttpClient) {}

  login(data: { email: string; password: string }): Observable<any> {
    return this.http.post(`${this.base}/login`, data);
  }

  getItems(): Observable<any[]> {
    return this.http.get<any[]>(`${this.base}/items`);
  }

  addItem(data: { title: string; description: string }): Observable<any> {
    return this.http.post(`${this.base}/items`, data);
  }

  updateItem(id: number, data: { title: string; description: string }): Observable<any> {
    return this.http.put(`${this.base}/items/${id}`, data);
  }

  deleteItem(id: number): Observable<any> {
    return this.http.delete(`${this.base}/items/${id}`);
  }
}