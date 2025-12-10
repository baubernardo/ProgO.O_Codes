# 🔌 Guia de Integração Backend - FitStore Checkout

## 📋 Resumo das Rotas Esperadas

O frontend espera os seguintes endpoints no backend:

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/pedidos` | Adiciona item ao pedido (cria ABERTO se novo) |
| POST | `/pedidos/confirmar/{uuid}` | Confirma pedido (ABERTO → CONFIRMADO) |
| GET | `/pedidos/{uuid}` | Recupera dados do pedido |
| GET | `/pedidos` | Lista pedidos do usuário |

## 🔍 Detalhamento de Cada Endpoint

### 1️⃣ POST /pedidos

**Responsabilidade**: Criar novo pedido com status ABERTO ou adicionar item a existente.

**Request**:
```json
{
  "idProduto": 1,
  "quantidade": 2,
  "uuid": "550e8400-e29b-41d4-a716-446655440000"  // opcional
}
```

**Parâmetros**:
- `idProduto` (number, obrigatório): ID do produto a adicionar
- `quantidade` (number, obrigatório): Quantidade > 0
- `uuid` (string, opcional): UUID de um pedido existente (para adicionar itens)

**Lógica Backend Esperada**:
```
SE uuid é fornecido:
  SE pedido com este uuid existe E status = ABERTO:
    Adicionar novo item_pedido com este idProduto e quantidade
  SENÃO:
    Retornar erro 404 ou 400
SENÃO:
  Criar novo pedido com status = ABERTO
  Gerar novo UUID automaticamente
  Adicionar item_pedido com este idProduto e quantidade

Retornar: void (200 OK) ou opcionalmente { uuid, status, ... }
```

**Response**:
```
Status: 200 OK
Body: (vazio - void)

OU (alternativa)

Status: 201 Created
Body: {
  "uuid": "550e8400-e29b-41d4-a716-446655440000",
  "status": "ABERTO",
  "valor_total": null,  // será calculado quando confirmar
  "data_criacao": "2025-12-09T10:30:00"
}
```

**Exemplo de Teste (cURL)**:
```bash
# Primeira chamada (cria novo pedido)
curl -X POST http://localhost:8080/pedidos \
  -H "Content-Type: application/json" \
  -d '{
    "idProduto": 1,
    "quantidade": 2
  }'

# Resposta (frontend armazena este uuid)
# 550e8400-e29b-41d4-a716-446655440000

# Segunda chamada (adiciona ao mesmo pedido)
curl -X POST http://localhost:8080/pedidos \
  -H "Content-Type: application/json" \
  -d '{
    "uuid": "550e8400-e29b-41d4-a716-446655440000",
    "idProduto": 2,
    "quantidade": 1
  }'
```

---

### 2️⃣ POST /pedidos/confirmar/{uuid}

**Responsabilidade**: Finalizar pedido, mudar status ABERTO → CONFIRMADO, associar cliente.

**Request**:
```
POST /pedidos/confirmar/550e8400-e29b-41d4-a716-446655440000
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...  // se seu sistema usa JWT
Content-Type: application/json
{}  // corpo vazio
```

**Parâmetros**:
- `{uuid}` (path param, obrigatório): UUID do pedido a confirmar
- Autenticação: Via header `Authorization` ou `SecurityContext`

**Lógica Backend Esperada**:
```
1. Extrair email do usuário autenticado (SecurityContext.getUserPrincipal())
2. Validar se pedido com uuid existe
3. Validar se status = ABERTO
4. Validar se pedido tem pelo menos 1 item_pedido
5. Calcular valor_total = SUM(item.quantidade × item.preco)
6. Mudar status = CONFIRMADO
7. Associar cliente_email = email do usuário logado
8. Retornar dados completos do pedido
```

**Response**:
```
Status: 200 OK
Body: {
  "uuid": "550e8400-e29b-41d4-a716-446655440000",
  "status": "CONFIRMADO",
  "valor_total": 289.70,
  "cliente_email": "joao@email.com",
  "data_criacao": "2025-12-09T10:30:00",
  "data_confirmacao": "2025-12-09T10:35:00",
  "items": [
    {
      "id_item": 1,
      "id_produto": 1,
      "quantidade": 2,
      "preco_unitario": 99.90,
      "subtotal": 199.80
    },
    {
      "id_item": 2,
      "id_produto": 2,
      "quantidade": 1,
      "preco_unitario": 89.90,
      "subtotal": 89.90
    }
  ]
}
```

**Erros Possíveis**:
```
400 Bad Request:
{
  "message": "Pedido não encontrado"
}

400 Bad Request:
{
  "message": "Pedido não está em status ABERTO"
}

400 Bad Request:
{
  "message": "Pedido não contém itens"
}

401 Unauthorized:
{
  "message": "Usuário não autenticado"
}
```

**Exemplo de Teste (cURL)**:
```bash
curl -X POST http://localhost:8080/pedidos/confirmar/550e8400-e29b-41d4-a716-446655440000 \
  -H "Authorization: Bearer seu_token_aqui" \
  -H "Content-Type: application/json" \
  -d '{}'
```

---

### 3️⃣ GET /pedidos/{uuid}

**Responsabilidade**: Recuperar dados de um pedido em construção (opcional).

**Request**:
```
GET /pedidos/550e8400-e29b-41d4-a716-446655440000
```

**Parâmetros**:
- `{uuid}` (path param, obrigatório): UUID do pedido

**Response**:
```
Status: 200 OK
Body: {
  "uuid": "550e8400-e29b-41d4-a716-446655440000",
  "status": "ABERTO",
  "valor_total": null,
  "data_criacao": "2025-12-09T10:30:00",
  "items": [
    {
      "id_item": 1,
      "id_produto": 1,
      "quantidade": 2,
      "preco_unitario": 99.90,
      "subtotal": 199.80
    }
  ]
}
```

**Uso Frontend**:
```typescript
// Opcional: recuperar estado do pedido se página recarregar
this.pedidoService.obterPedidoAberto(uuid).subscribe(pedido => {
  console.log('Pedido atual:', pedido);
  // Pode sincronizar carrinho com estado backend se necessário
});
```

---

### 4️⃣ GET /pedidos

**Responsabilidade**: Listar todos os pedidos do usuário autenticado (para "Meus Pedidos").

**Request**:
```
GET /pedidos
Authorization: Bearer seu_token_aqui
```

**Response**:
```
Status: 200 OK
Body: [
  {
    "uuid": "550e8400-e29b-41d4-a716-446655440000",
    "status": "CONFIRMADO",
    "valor_total": 289.70,
    "data_criacao": "2025-12-09T10:30:00",
    "data_confirmacao": "2025-12-09T10:35:00"
  },
  {
    "uuid": "660f9511-f30c-52e5-b817-557766551111",
    "status": "ABERTO",
    "valor_total": null,
    "data_criacao": "2025-12-08T15:00:00"
  }
]
```

**Uso Frontend** (futuro - página "Meus Pedidos"):
```typescript
this.pedidoService.listarPedidos().subscribe(pedidos => {
  this.meusPedidos = pedidos;  // exibir em table/list
});
```

---

## 🗄️ Estrutura de Banco de Dados Esperada

```sql
-- Tabela de Pedidos
CREATE TABLE pedidos (
  id INT PRIMARY KEY AUTO_INCREMENT,
  uuid VARCHAR(36) UNIQUE NOT NULL,
  cliente_email VARCHAR(255) NOT NULL,  -- extraído do SecurityContext
  status ENUM('ABERTO', 'CONFIRMADO', 'PAGO', 'CANCELADO', 'ENTREGUE') DEFAULT 'ABERTO',
  valor_total DECIMAL(10, 2),  -- NULL enquanto ABERTO
  data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  data_confirmacao TIMESTAMP NULL,
  FOREIGN KEY (cliente_email) REFERENCES usuarios(email)
);

-- Tabela de Itens do Pedido
CREATE TABLE itens_pedido (
  id INT PRIMARY KEY AUTO_INCREMENT,
  id_pedido INT NOT NULL,
  id_produto INT NOT NULL,
  quantidade INT NOT NULL,
  preco_unitario DECIMAL(10, 2) NOT NULL,
  FOREIGN KEY (id_pedido) REFERENCES pedidos(id),
  FOREIGN KEY (id_produto) REFERENCES produtos(id),
  UNIQUE (id_pedido, id_produto)  -- um produto por pedido apenas
);

-- Índices
CREATE INDEX idx_pedidos_uuid ON pedidos(uuid);
CREATE INDEX idx_pedidos_cliente ON pedidos(cliente_email);
CREATE INDEX idx_pedidos_status ON pedidos(status);
CREATE INDEX idx_itens_pedido ON itens_pedido(id_pedido);
```

---

## 🔐 Autenticação e Segurança

### Requerimentos:
1. **POST /pedidos**: Pode ser anônimo (cria pedido temporário) ou autenticado
2. **POST /pedidos/confirmar/{uuid}**: **OBRIGATÓRIO autenticado**
   - Extrai email via `SecurityContext.getUserPrincipal()`
   - Associa pedido ao usuário logado
3. **GET /pedidos/{uuid}**: Autenticado (valida se pertence ao usuário)
4. **GET /pedidos**: Autenticado (retorna apenas do usuário)

### Implementação Recomendada:
```java
@RestController
@RequestMapping("/pedidos")
public class PedidoController {

  @PostMapping("/confirmar/{uuid}")
  @PreAuthorize("isAuthenticated()")  // Spring Security
  public ResponseEntity<?> confirmarPedido(
    @PathVariable String uuid,
    @CurrentUser Usuario usuario  // seu custom annotation
  ) {
    String email = usuario.getEmail();  // ou SecurityContext.getContext()...
    // ... usar email para associar pedido
  }
}
```

---

## 🧪 Teste de Integração Completa

```bash
#!/bin/bash

# Variáveis
API="http://localhost:8080"
TOKEN="seu_jwt_token_aqui"

echo "1️⃣  Criar novo pedido (adicionar item 1)"
RESPONSE1=$(curl -s -X POST $API/pedidos \
  -H "Content-Type: application/json" \
  -d '{"idProduto": 1, "quantidade": 2}')
echo $RESPONSE1
UUID=$(echo $RESPONSE1 | jq -r '.uuid // empty')

if [ -z "$UUID" ]; then
  echo "❌ Falha ao criar pedido"
  exit 1
fi

echo -e "\n2️⃣  UUID do pedido: $UUID"

echo -e "\n3️⃣  Adicionar segundo item ao mesmo pedido"
curl -s -X POST $API/pedidos \
  -H "Content-Type: application/json" \
  -d "{\"uuid\": \"$UUID\", \"idProduto\": 2, \"quantidade\": 1}"

echo -e "\n4️⃣  Recuperar dados do pedido"
curl -s -X GET "$API/pedidos/$UUID" | jq

echo -e "\n5️⃣  Confirmar pedido (requer autenticação)"
curl -s -X POST "$API/pedidos/confirmar/$UUID" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{}' | jq

echo -e "\n6️⃣  Listar pedidos do usuário"
curl -s -X GET "$API/pedidos" \
  -H "Authorization: Bearer $TOKEN" | jq

echo -e "\n✅ Teste completo!"
```

---

## ⚠️ Gotchas Comuns

| Problema | Solução |
|----------|---------|
| POST /pedidos retorna 500 | Validar se `idProduto` existe na tabela `produtos` |
| POST /pedidos/confirmar retorna 401 | Verificar token JWT ou sessão do usuário |
| POST /pedidos/confirmar retorna 400 | Pedido pode estar em status diferente de ABERTO |
| GET /pedidos não retorna dados | Verificar autenticação ou filtro por usuário |
| UUID não é UUID válido no BD | Considerar usar library UUID (java.util.UUID) |

---

## 📝 Checklist para Backend

- [ ] Endpoint POST /pedidos cria novo pedido com status ABERTO
- [ ] Endpoint POST /pedidos aceita uuid opcional para adicionar itens
- [ ] POST /pedidos retorna UUID (novo ou existente)
- [ ] Endpoint POST /pedidos/confirmar/{uuid} requer autenticação
- [ ] POST /pedidos/confirmar valida status ABERTO antes de confirmar
- [ ] POST /pedidos/confirmar muda status para CONFIRMADO
- [ ] POST /pedidos/confirmar calcula valor_total
- [ ] GET /pedidos/{uuid} retorna dados do pedido
- [ ] GET /pedidos retorna lista de pedidos do usuário autenticado
- [ ] Tabelas BD criadas com schema correto
- [ ] Índices criados para performance
- [ ] Testes de API executados com sucesso
- [ ] Documento de API (Swagger/OpenAPI) atualizado
- [ ] Documentação README atualizada com novos endpoints

---

**Última atualização**: 2025-12-09
**Versão**: 1.0 (Fluxo de Pedidos v2)
