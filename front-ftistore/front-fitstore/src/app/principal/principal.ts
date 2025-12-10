import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProdutoService } from '../produto-service';
import { CarrinhoService } from '../carrinho-service';

@Component({
  selector: 'app-principal',
  imports: [CommonModule],
  templateUrl: './principal.html',
  styleUrl: './principal.css',
})
export class Principal implements OnInit {
  private produtoService = inject(ProdutoService);
  private carrinhoService = inject(CarrinhoService);

  public listaProdutos: any[] = [];

  ngOnInit(): void {
    this.produtoService.listar().subscribe({
      next: (produtos) => {
        this.listaProdutos = produtos;
      }
    });
  }

  adicionarAoCarrinho(produto: any): void {
    this.carrinhoService.adicionarAoCarrinho(produto, 1);
    alert(`${produto.nome} adicionado ao carrinho! 🛒`);
  }
}
