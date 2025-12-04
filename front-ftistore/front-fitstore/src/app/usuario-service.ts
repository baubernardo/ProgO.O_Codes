import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
   private readonly http = inject(HttpClient);
  
  criarUsuario(usuario: any): Observable<any> {
    return this.http.post<any>('http://localhost:8080/usuarios', usuario);
  }
}
