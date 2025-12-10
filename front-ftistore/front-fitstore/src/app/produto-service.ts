import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_CONFIG } from './config/api.config';

@Injectable({
  providedIn: 'root',
})
export class ProdutoService {
  private http = inject(HttpClient);
  private baseUrl = API_CONFIG.baseUrl;

  listar(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/produtos`);
  }

  criar(produto: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/produtos`, produto);
  }

  uploadImagem(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<any>(`${this.baseUrl}/produtos/upload`, formData);
  }
}
