import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CarrinhoService, CartItem } from '../carrinho-service';
import { PedidoService, PedidoPayload } from '../pedido-service';

@Component({
  selector: 'app-checkout',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './checkout.html',
  styleUrl: './checkout.css',
})
export class Checkout implements OnInit {
  private carrinhoService = inject(CarrinhoService);
  private pedidoService = inject(PedidoService);
  private router = inject(Router);

  public itens: CartItem[] = [];
  public total = 0;
  public loading = false;
  public successMessage = '';
  public errorMessage = '';
  public pedidoUuid: string | null = null;
  public step: 'adicionar-itens' | 'confirmar' = 'adicionar-itens'; // Controla o fluxo

  public checkoutForm = new FormGroup({
    nomeCompleto: new FormControl('', [Validators.required, Validators.minLength(5)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    telefone: new FormControl('', [Validators.required]),
    endereco: new FormControl('', [Validators.required]),
    numero: new FormControl('', [Validators.required]),
    complemento: new FormControl(''),
    bairro: new FormControl('', [Validators.required]),
    cidade: new FormControl('', [Validators.required]),
    uf: new FormControl('', [Validators.required]),
    cep: new FormControl('', [Validators.required]),
    metodo_pagamento: new FormControl('cartao', [Validators.required]),
  });

  ngOnInit(): void {
    this.carrinhoService.cart$.subscribe((itens) => {
      this.itens = itens;
      this.total = this.carrinhoService.obterTotal();

      if (this.itens.length === 0) {
        this.router.navigate(['/carrinho']);
      }
    });

    // Recupera o UUID do pedido se já foi criado
    this.pedidoUuid = this.carrinhoService.getPedidoUuid();
  }

  /**
   * Passo 1: Adiciona todos os itens do carrinho ao pedido
   * POST /pedidos - cria novo pedido com status ABERTO
   */
  adicionarItensToPedido(): void {
    this.errorMessage = '';
    this.successMessage = '';
    this.loading = true;

    // Cria promessas para adicionar cada item
      const promises = this.itens.map(i => {
        const payload = { idProduto: i.id, quantidade: i.quantidade } as any;
        return this.pedidoService.adicionarAoPedido(payload).toPromise();
      });

      Promise.all(promises)
        .then((responses: any[]) => {
          
          let foundUuid: string | undefined;
          for (const res of responses) {
            if (!res) continue;
            if (res.body && res.body.uuid) {
              foundUuid = res.body.uuid;
              break;
            }
            const location = res.headers ? res.headers.get('Location') || res.headers.get('location') : null;
            if (location) {
              const parts = location.split('/');
              const candidate = parts[parts.length - 1];
              if (candidate) {
                foundUuid = candidate;
                break;
              }
            }
          }

          

          if (foundUuid) {
            this.pedidoUuid = foundUuid;
            this.carrinhoService.setPedidoUuid(this.pedidoUuid);
          }

          this.step = 'confirmar';
        })
        .catch(err => {
          console.error('Erro ao adicionar itens ao pedido', err);
          const status = err?.status;
          const message = err?.message || err?.statusText || JSON.stringify(err?.error) || 'Erro desconhecido';
          this.loading = false;
          this.errorMessage = `Erro ao adicionar itens ao pedido (status: ${status || 'N/A'}) - ${message}`;
          // Mostrar alerta curta para o usuário e log completo no console
          alert(this.errorMessage);
        });
  }

  /**
   * Passo 2: Valida o formulário e confirma o pedido
   * POST /pedidos/confirmar/{uuid} - finaliza e muda status ABERTO → CONFIRMADO
   */
  finalizarCompra(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (this.checkoutForm.invalid) {
      this.errorMessage = 'Preencha todos os campos obrigatórios corretamente.';
      return;
    }

    if (!this.pedidoUuid) {
      this.errorMessage = 'Erro: UUID do pedido não encontrado. Comece novamente.';
      return;
    }

    this.loading = true;

    

    // Confirma o pedido no backend
    this.pedidoService.confirmarPedido(this.pedidoUuid).subscribe({
      next: (resp) => {
        this.loading = false;
        this.successMessage = 'Pedido confirmado com sucesso! Redirecionando...';
        
        this.carrinhoService.limparCarrinho();
        setTimeout(() => {
          this.router.navigate(['/']);
        }, 2000);
      },
      error: (err) => {
        this.loading = false;
        console.error('❌ Erro ao confirmar pedido:', err);
        this.errorMessage = `Erro ao confirmar pedido: ${err.error?.message || err.statusText}`;
      },
    });
  }

  voltarAoCarrinho(): void {
    this.router.navigate(['/carrinho']);
  }

  // Validação de campos
  getNomeError(): string {
    const ctrl = this.checkoutForm.get('nomeCompleto');
    if (ctrl?.hasError('required')) return 'Nome é obrigatório';
    if (ctrl?.hasError('minlength')) return 'Mínimo 5 caracteres';
    return '';
  }

  getEmailError(): string {
    const ctrl = this.checkoutForm.get('email');
    if (ctrl?.hasError('required')) return 'Email é obrigatório';
    if (ctrl?.hasError('email')) return 'Email inválido';
    return '';
  }
}
