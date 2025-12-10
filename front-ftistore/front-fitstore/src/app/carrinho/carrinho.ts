import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CarrinhoService, CartItem } from '../carrinho-service';

@Component({
  selector: 'app-carrinho',
  imports: [CommonModule, RouterLink, FormsModule],
  templateUrl: './carrinho.html',
  styleUrl: './carrinho.css',
})
export class Carrinho implements OnInit {
  private carrinhoService = inject(CarrinhoService);

  public itens: CartItem[] = [];
  public total = 0;

  ngOnInit(): void {
    this.carrinhoService.cart$.subscribe((itens) => {
      this.itens = itens;
      this.total = this.carrinhoService.obterTotal();
    });
  }

  removerItem(id: number): void {
    this.carrinhoService.removerDoCarrinho(id);
  }

  atualizarQuantidade(id: number, novaQtd: number): void {
    if (novaQtd > 0) {
      this.carrinhoService.atualizarQuantidade(id, novaQtd);
    }
  }

  diminuirQuantidade(id: number, qtdAtual: number): void {
    if (qtdAtual > 1) {
      this.atualizarQuantidade(id, qtdAtual - 1);
    }
  }

  aumentarQuantidade(id: number, qtdAtual: number): void {
    this.atualizarQuantidade(id, qtdAtual + 1);
  }

  limparCarrinho(): void {
    if (confirm('Tem certeza que deseja limpar o carrinho?')) {
      this.carrinhoService.limparCarrinho();
    }
  }
}
