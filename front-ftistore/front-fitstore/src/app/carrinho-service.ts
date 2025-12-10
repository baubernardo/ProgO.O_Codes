import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface CartItem {
  id: number;
  nome: string;
  preco: number;
  quantidade: number;
  imagem?: string;
}

export interface CarrinhoState {
  items: CartItem[];
  pedidoUuid?: string;
}

@Injectable({
  providedIn: 'root',
})
export class CarrinhoService {
  private cartKey = 'fitstore-cart';
  private pedidoUuidKey = 'fitstore-pedido-uuid';
  private cartSubject = new BehaviorSubject<CartItem[]>(this.carregarCarrinho());

  public cart$ = this.cartSubject.asObservable();

  constructor() {}

  private carregarCarrinho(): CartItem[] {
    const stored = localStorage.getItem(this.cartKey);
    return stored ? JSON.parse(stored) : [];
  }

  private salvarCarrinho(items: CartItem[]): void {
    localStorage.setItem(this.cartKey, JSON.stringify(items));
    this.cartSubject.next(items);
  }

  /**
   * Obtém ou cria um UUID para o pedido em construção
   */
  obterOuCriarPedidoUuid(): string {
    let uuid = localStorage.getItem(this.pedidoUuidKey);
    if (!uuid) {
      // Se não houver UUID, será criado pelo backend na primeira chamada
      // Por enquanto, retornamos vazio
      console.log('ℹ️ Nenhum UUID de pedido encontrado. Será criado na primeira adição.');
    }
    return uuid || '';
  }

  /**
   * Define o UUID do pedido (chamado após primeira adição ao backend)
   */
  setPedidoUuid(uuid: string): void {
    localStorage.setItem(this.pedidoUuidKey, uuid);
    console.log('📝 UUID do pedido definido:', uuid);
  }

  /**
   * Obtém o UUID do pedido armazenado
   */
  getPedidoUuid(): string | null {
    return localStorage.getItem(this.pedidoUuidKey);
  }

  // Adicionar ao carrinho
  adicionarAoCarrinho(produto: any, quantidade: number = 1): void {
    const items = this.cartSubject.value;
    const existente = items.find(i => i.id === produto.id);

    if (existente) {
      existente.quantidade += quantidade;
    } else {
      items.push({
        id: produto.id,
        nome: produto.nome,
        preco: produto.preco,
        quantidade,
        imagem: produto.imagem,
      });
    }

    this.salvarCarrinho(items);
    console.log(`✅ ${produto.nome} adicionado ao carrinho (qty: ${quantidade})`);
  }

  // Remover do carrinho
  removerDoCarrinho(produtoId: number): void {
    const items = this.cartSubject.value.filter(i => i.id !== produtoId);
    this.salvarCarrinho(items);
    console.log(`🗑️ Produto ${produtoId} removido do carrinho`);
  }

  // Atualizar quantidade
  atualizarQuantidade(produtoId: number, quantidade: number): void {
    const items = this.cartSubject.value;
    const item = items.find(i => i.id === produtoId);
    if (item) {
      if (quantidade <= 0) {
        this.removerDoCarrinho(produtoId);
      } else {
        item.quantidade = quantidade;
        this.salvarCarrinho(items);
      }
    }
  }

  // Obter total
  obterTotal(): number {
    return this.cartSubject.value.reduce((acc, item) => acc + item.preco * item.quantidade, 0);
  }

  // Obter quantidade de itens
  obterQuantidadeItens(): number {
    return this.cartSubject.value.reduce((acc, item) => acc + item.quantidade, 0);
  }

  // Limpar carrinho
  limparCarrinho(): void {
    this.salvarCarrinho([]);
    localStorage.removeItem(this.pedidoUuidKey);
    console.log('🧹 Carrinho e UUID do pedido limpos');
  }

  // Obter carrinho atual (snapshot)
  obterCarrinho(): CartItem[] {
    return this.cartSubject.value;
  }
}

