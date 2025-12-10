# Fluxo de Pedidos - FitStore Frontend

## 📋 Visão Geral

O frontend foi atualizado para integrar com o novo fluxo de pedidos do backend. O sistema agora segue um padrão de 2 passos:

1. **Passo 1 - Adicionar Itens ao Pedido**: Carrinho é convertido em um pedido com status `ABERTO`
2. **Passo 2 - Confirmar Pedido**: Preenche informações pessoais/endereço e confirma o pedido

## 🔄 Fluxo Completo de Compra

```
Cliente navega produtos
    ↓
Clica "🛒 Adicionar ao Carrinho"
    ↓
Cartão (localStorage) armazena itens
    ↓
Cliente clica "Ir para Checkout" na página /carrinho
    ↓
[PASSO 1] Confirma lista de itens do carrinho
    ↓
POST /pedidos (com cada item individualmente)
    ↓
Backend retorna void (cria pedido ABERTO com uuid)
    ↓
Frontend armazena uuid no localStorage
    ↓
[PASSO 2] Preenche formulário (dados pessoais + endereço)
    ↓
POST /pedidos/confirmar/{uuid}
    ↓
Backend confirma pedido: ABERTO → CONFIRMADO
    ↓
Sucesso! Carrinho + UUID são limpos
    ↓
Redireciona para home
```

## 🛠️ Serviços Atualizados

### `pedido-service.ts`

#### Novos métodos principais:

**1. `adicionarAoPedido(payload: PedidoPayload): Observable<any>`**
```typescript
// POST /pedidos
// Cria novo pedido ou adiciona item a pedido existente
interface PedidoPayload {
  uuid?: string;        // opcional, passado se pedido já existe
  idProduto: number;    // ID do produto
  quantidade: number;   // quantidade
}

// Exemplo de uso:
this.pedidoService.adicionarAoPedido({
  idProduto: 1,
  quantidade: 2
}).subscribe({
  next: (resp) => console.log('Item adicionado'),
  error: (err) => console.error('Erro', err)
});
```

**2. `confirmarPedido(uuid: string): Observable<any>`**
```typescript
// POST /pedidos/confirmar/{uuid}
// Finaliza pedido: ABERTO → CONFIRMADO
// Requer autenticação (SecurityContext extrai email)

this.pedidoService.confirmarPedido(uuidDoPedido).subscribe({
  next: (resp) => console.log('Pedido confirmado'),
  error: (err) => console.error('Erro na confirmação', err)
});
```

**3. `obterPedidoAberto(uuid: string): Observable<Pedido>`**
```typescript
// GET /pedidos/{uuid}
// Recupera dados do pedido em construção

this.pedidoService.obterPedidoAberto(uuid).subscribe(pedido => {
  console.log('Pedido:', pedido);
});
```

**4. `listarPedidos(): Observable<Pedido[]>`**
```typescript
// GET /pedidos
// Lista todos os pedidos do usuário autenticado
```

### `carrinho-service.ts`

Adicionados métodos para gerenciar o UUID do pedido:

```typescript
// Obtém ou retorna vazio se não existir
obterOuCriarPedidoUuid(): string

// Define o UUID após primeira criação
setPedidoUuid(uuid: string): void

// Recupera UUID armazenado
getPedidoUuid(): string | null

// Limpa carrinho + UUID
limparCarrinho(): void
```

### `checkout.ts`

Agora implementa o fluxo de 2 passos:

```typescript
step: 'adicionar-itens' | 'confirmar' = 'adicionar-itens';
pedidoUuid: string | null = null;

/**
 * PASSO 1: Adiciona itens ao pedido (POST /pedidos)
 */
adicionarItensToPedido(): void {
  // Faz Promise.all() com POST /pedidos para cada item
  // Após sucesso, muda para step = 'confirmar'
}

/**
 * PASSO 2: Confirma pedido (POST /pedidos/confirmar/{uuid})
 */
finalizarCompra(): void {
  // Valida formulário
  // Chama POST /pedidos/confirmar/{uuid}
  // Limpa carrinho + uuid
  // Redireciona para home
}
```

## 📍 Estados do Pedido (Backend)

Enum `StatusPedido`:
- `ABERTO` - pedido em construção (pode adicionar/remover itens)
- `CONFIRMADO` - pedido finalizado, aguardando pagamento
- `PAGO` - pagamento recebido
- `CANCELADO` - pedido cancelado
- `ENTREGUE` - pedido entregue

## 💾 Armazenamento Local

**localStorage keys:**
- `fitstore-cart` - array JSON com CartItem[] (itens do carrinho)
- `fitstore-pedido-uuid` - UUID do pedido em construção (string)
- `fitstore-theme` - tema ativo (dark/light)

## 📱 Componentes Envolvidos

### `Principal` (/home)
- Listagem de produtos
- Botão "🛒 Adicionar ao Carrinho" → adiciona item via CarrinhoService

### `Carrinho` (/carrinho)
- Exibe itens do carrinho
- Permite editar quantidades
- Botão "Ir para Checkout" → navega para /checkout

### `Checkout` (/checkout)
- **Passo 1**: Revisa itens, clica "Prosseguir para Confirmação"
  - Adiciona cada item via `adicionarAoPedido()`
  - Armazena UUID retornado
- **Passo 2**: Preenche formulário pessoal/endereço
  - Valida campos
  - Clica "Confirmar e Finalizar"
  - Chama `confirmarPedido(uuid)`

### `Header` (/header)
- Contador de itens no carrinho (atualizado em tempo real)
- Botão de toggle de tema

## 🔐 Autenticação

⚠️ **Importante**: O endpoint `POST /pedidos/confirmar/{uuid}` requer autenticação.

O backend usa `SecurityContext.getUserPrincipal()` para extrair o email do usuário logado.

**Frontend deve:**
1. Implementar login/autenticação (JWT token, session, etc.)
2. Incluir credenciais nas requisições HTTP
3. Exemplo com HttpClient interceptor:

```typescript
// Adicionar token aos headers
{
  withCredentials: true,  // se usar cookies
  headers: {
    'Authorization': `Bearer ${token}`  // se usar JWT
  }
}
```

## 🧪 Fluxo de Teste

1. Abra DevTools (F12) → Console
2. Vá para home, veja "📤 Enviando items para pedido:" nos logs
3. Clique em um produto → "🛒 Adicionar ao Carrinho"
4. Veja no localStorage: `fitstore-cart` tem o item
5. Clique no carrinho (ícone no header)
6. Clique "Ir para Checkout"
7. **Passo 1**: Veja "Processar..." 
   - Console mostra "✅ Todos os itens adicionados ao pedido"
   - localStorage agora tem `fitstore-pedido-uuid`
8. **Passo 2**: Preencha dados pessoais/endereço
9. Clique "Confirmar e Finalizar"
   - Console mostra "✅ Confirmando pedido: [uuid]"
   - Se sucesso: "✅ Pedido confirmado"
   - Se erro: mostra mensagem de erro

## 📊 Payload Detalhado

### POST /pedidos
```json
{
  "idProduto": 1,
  "quantidade": 2,
  "uuid": "550e8400-e29b-41d4-a716-446655440000"  // opcional
}
```

### POST /pedidos/confirmar/{uuid}
```
POST /pedidos/confirmar/550e8400-e29b-41d4-a716-446655440000
Headers: Authorization: Bearer [token] (se necessário)
Body: {} (vazio)
```

## 🐛 Troubleshooting

### Problema: "UUID do pedido não encontrado"
**Solução**: Certifique-se de que o Passo 1 foi completado com sucesso.

### Problema: "Erro ao confirmar pedido"
**Solução**: 
- Verifique se o backend aceita a autenticação
- Certifique-se de que o UUID no localStorage corresponde a um pedido ABERTO no backend
- Verifique console.log de erro para mais detalhes

### Problema: Carrinho não limpa após compra
**Solução**: Verifique se `carrinhoService.limparCarrinho()` foi chamado em `finalizarCompra()`.

## 📝 Próximos Passos

- [ ] Implementar página de confirmação de pedido
- [ ] Implementar histórico de pedidos (Meus Pedidos)
- [ ] Integrar com gateway de pagamento
- [ ] Adicionar sistema de rastreamento de pedidos
- [ ] Implementar autenticação de usuário
