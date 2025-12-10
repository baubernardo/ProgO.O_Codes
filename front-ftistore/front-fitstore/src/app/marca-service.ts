import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_CONFIG } from './config/api.config';

@Injectable({
  providedIn: 'root',
})
export class MarcaService {
  private http = inject(HttpClient);
  private baseUrl = API_CONFIG.baseUrl;

  listar(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/marcas`);
  }
}
