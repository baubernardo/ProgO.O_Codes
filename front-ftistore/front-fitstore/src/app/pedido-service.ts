import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_CONFIG } from './config/api.config';

export interface ItensPedidoPayload {
  idProduto: number;
  quantidade: number;
}

export interface PedidoPayload {
  uuid?: string;
  idProduto: number;
  quantidade: number;
}

export interface Pedido {
  uuid: string;
  status: string;
  valor_total?: number;
  data_criacao?: string;
  items?: any[];
}

@Injectable({
  providedIn: 'root',
})
export class PedidoService {
  private http = inject(HttpClient);
  private baseUrl = API_CONFIG.baseUrl;

  /**
   * POST /pedidos
   * Cria um novo pedido com status ABERTO ou adiciona itens a um pedido existente
   * @param payload - PedidoPayload com idProduto e quantidade
   * @returns Observable com resposta (void no backend)
   */
  adicionarAoPedido(payload: PedidoPayload): Observable<HttpResponse<any>> {
    return this.http.post<any>(`${this.baseUrl}/pedidos`, payload, { observe: 'response' });
  }

  /**
   * POST /pedidos/confirmar/{uuid}
   * Finaliza/confirma o pedido (muda status ABERTO → CONFIRMADO)
   * Requer autenticação
   * @param uuid - UUID do pedido a confirmar
   * @returns Observable com resposta do servidor
   */
  confirmarPedido(uuid: string): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/pedidos/confirmar/${uuid}`, {});
  }

  /**
   * GET /pedidos/{uuid}
   * Busca um pedido aberto pelo UUID
   * @param uuid - UUID do pedido
   * @returns Observable com dados do pedido
   */
  obterPedidoAberto(uuid: string): Observable<Pedido> {
    console.log('🔍 Buscando pedido:', uuid);
    return this.http.get<Pedido>(`${this.baseUrl}/pedidos/${uuid}`);
  }

  /**
   * GET /pedidos
   * Lista todos os pedidos do usuário autenticado
   * @returns Observable com array de pedidos
   */
  listarPedidos(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.baseUrl}/pedidos`);
  }

  /**
   * Mantido para compatibilidade (deprecado)
   * @deprecated Use adicionarAoPedido() e confirmarPedido() em vez disso
   */
  criarPedido(pedido: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/pedidos`, pedido);
  }

  /**
   * Mantido para compatibilidade (deprecado)
   * @deprecated Use obterPedidoAberto() em vez disso
   */
  obterPedido(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/pedidos/${id}`);
  }
}
