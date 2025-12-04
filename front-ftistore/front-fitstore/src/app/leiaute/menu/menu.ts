import { Component, inject, OnInit } from '@angular/core';
import { CategoriaService } from '../../categoria-service';

@Component({
  selector: 'app-menu',
  imports: [],
  templateUrl: './menu.html',
  styleUrl: './menu.css',
})
export class Menu implements OnInit {
  private service = inject(CategoriaService);

  public listaCategorias: any[] = [];

  ngOnInit(): void {
    this.service.listar().subscribe({
      next: (categorias) => {
        this.listaCategorias = categorias;
      },
      error: (erro) => {
        console.error('Erro ao carregar categorias:', erro);
      }
    });
  }

}
