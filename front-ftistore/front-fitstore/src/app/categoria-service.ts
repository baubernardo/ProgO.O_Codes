import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoriaService {
  private http = inject(HttpClient);
  
  listar(): Observable<any[]> {
    return this.http.get<any[]>('http://localhost:8080/categorias');
  }

}
