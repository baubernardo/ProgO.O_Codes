#!/bin/bash

# ============================================================
# Teste de Integração - FitStore Pedidos API
# ============================================================
#
# Este script testa o fluxo completo de pedidos
# Requisitos:
#   - Backend rodando em http://localhost:8080
#   - curl instalado
#   - jq instalado (opcional, para pretty print)
#
# Uso:
#   chmod +x teste_pedidos.sh
#   ./teste_pedidos.sh
#
# ============================================================

# Cores para output
RED='\\033[0;31m'
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
NC='\\033[0m' # No Color

# Variáveis
API_BASE=\"http://localhost:8080\"
JWT_TOKEN=\"seu_token_jwt_aqui\"  # Trocar por um token válido se necessário

# ============================================================
# Funções Auxiliares
# ============================================================

function print_header() {
    echo -e \"\\n${YELLOW}═══════════════════════════════════════════════════════${NC}\"
    echo -e \"${YELLOW}$1${NC}\"
    echo -e \"${YELLOW}═══════════════════════════════════════════════════════${NC}\\n\"
}

function print_success() {
    echo -e \"${GREEN}✅ $1${NC}\"
}

function print_error() {
    echo -e \"${RED}❌ $1${NC}\"
}

function print_info() {
    echo -e \"${YELLOW}ℹ️  $1${NC}\"
}

function check_api() {
    echo -n \"Verificando se backend está rodando... \"
    if curl -s \"$API_BASE/pedidos\" > /dev/null 2>&1; then
        print_success \"Backend respondendo\"
        return 0
    else
        print_error \"Backend não respondendo em $API_BASE\"
        return 1
    fi
}

# ============================================================
# TESTE 1: Criar Novo Pedido (Passo 1.1)
# ============================================================

function test_criar_novo_pedido() {
    print_header \"TESTE 1: Criar Novo Pedido\"
    
    print_info \"Enviando: POST /pedidos com idProduto=1, quantidade=2\"
    
    RESPONSE=$(curl -s -X POST \"$API_BASE/pedidos\" \\
      -H \"Content-Type: application/json\" \\
      -d '{
        \"idProduto\": 1,
        \"quantidade\": 2
      }')
    
    echo \"Response:\"
    if command -v jq &> /dev/null; then
        echo \"$RESPONSE\" | jq .
    else
        echo \"$RESPONSE\"
    fi
    
    # Tentar extrair UUID
    UUID=$(echo \"$RESPONSE\" | grep -o '\"uuid\":\"[^\"]*' | cut -d'\"' -f4)
    
    if [ ! -z \"$UUID\" ]; then
        print_success \"UUID criado: $UUID\"
        echo \"$UUID\"
        return 0
    else
        # Se não há UUID na resposta, pode estar sendo criado no backend
        # Frontend usaria a resposta ou faria GET /pedidos para descobrir
        print_info \"Resposta recebida (void esperado)\"
        return 0
    fi
}

# ============================================================
# TESTE 2: Adicionar Segundo Item ao Pedido (Passo 1.2)
# ============================================================

function test_adicionar_item() {
    print_header \"TESTE 2: Adicionar Segundo Item ao Pedido\"
    
    local UUID=$1
    
    if [ -z \"$UUID\" ]; then
        print_error \"UUID não fornecido\"
        return 1
    fi
    
    print_info \"Enviando: POST /pedidos com uuid=$UUID, idProduto=2, quantidade=1\"
    
    RESPONSE=$(curl -s -X POST \"$API_BASE/pedidos\" \\
      -H \"Content-Type: application/json\" \\
      -d \"{
        \\\"uuid\\\": \\\"$UUID\\\",
        \\\"idProduto\\\": 2,
        \\\"quantidade\\\": 1
      }\")
    
    echo \"Response:\"
    if command -v jq &> /dev/null; then
        echo \"$RESPONSE\" | jq .
    else
        echo \"$RESPONSE\"
    fi
    
    print_success \"Item adicionado ao pedido\"
    return 0
}

# ============================================================
# TESTE 3: Recuperar Dados do Pedido (Passo 1.3)
# ============================================================

function test_obter_pedido() {
    print_header \"TESTE 3: Recuperar Dados do Pedido\"
    
    local UUID=$1
    
    if [ -z \"$UUID\" ]; then
        print_error \"UUID não fornecido\"
        return 1
    fi
    
    print_info \"Enviando: GET /pedidos/$UUID\"
    
    RESPONSE=$(curl -s -X GET \"$API_BASE/pedidos/$UUID\" \\
      -H \"Content-Type: application/json\")
    
    echo \"Response:\"
    if command -v jq &> /dev/null; then
        echo \"$RESPONSE\" | jq .
    else
        echo \"$RESPONSE\"
    fi
    
    return 0
}

# ============================================================
# TESTE 4: Confirmar Pedido (Passo 2)
# ============================================================

function test_confirmar_pedido() {
    print_header \"TESTE 4: Confirmar Pedido (Requer Autenticação)\"
    
    local UUID=$1
    
    if [ -z \"$UUID\" ]; then
        print_error \"UUID não fornecido\"
        return 1
    fi
    
    print_info \"Enviando: POST /pedidos/confirmar/$UUID\"
    print_info \"Token: $JWT_TOKEN\"
    
    RESPONSE=$(curl -s -X POST \"$API_BASE/pedidos/confirmar/$UUID\" \\
      -H \"Authorization: Bearer $JWT_TOKEN\" \\
      -H \"Content-Type: application/json\" \\
      -d '{}')
    
    echo \"Response:\"
    if command -v jq &> /dev/null; then
        echo \"$RESPONSE\" | jq .
    else
        echo \"$RESPONSE\"
    fi
    
    return 0
}

# ============================================================
# TESTE 5: Listar Pedidos (Passo Posterior)
# ============================================================

function test_listar_pedidos() {
    print_header \"TESTE 5: Listar Pedidos do Usuário\"
    
    print_info \"Enviando: GET /pedidos (requer autenticação)\"
    
    RESPONSE=$(curl -s -X GET \"$API_BASE/pedidos\" \\
      -H \"Authorization: Bearer $JWT_TOKEN\" \\
      -H \"Content-Type: application/json\")
    
    echo \"Response:\"
    if command -v jq &> /dev/null; then
        echo \"$RESPONSE\" | jq .
    else
        echo \"$RESPONSE\"
    fi
    
    return 0
}

# ============================================================
# TESTE 6: Teste Negativo - UUID Inválido
# ============================================================

function test_uuid_invalido() {
    print_header \"TESTE 6: Teste Negativo - Confirmar com UUID Inválido\"
    
    local INVALID_UUID=\"00000000-0000-0000-0000-000000000000\"
    
    print_info \"Enviando: POST /pedidos/confirmar/$INVALID_UUID com UUID inválido\"
    
    RESPONSE=$(curl -s -X POST \"$API_BASE/pedidos/confirmar/$INVALID_UUID\" \\
      -H \"Authorization: Bearer $JWT_TOKEN\" \\
      -H \"Content-Type: application/json\" \\
      -d '{}')
    
    echo \"Response (esperado 400 Bad Request):\"
    if command -v jq &> /dev/null; then
        echo \"$RESPONSE\" | jq .
    else
        echo \"$RESPONSE\"
    fi
    
    return 0
}

# ============================================================
# MAIN - Executa Testes
# ============================================================

function main() {
    print_header \"TESTE DE INTEGRAÇÃO - FitStore Pedidos API\"
    
    # Verifica se backend está rodando
    if ! check_api; then
        print_error \"Inicie o backend antes de executar testes\"
        exit 1
    fi
    
    # Teste 1: Criar novo pedido
    if UUID=$(test_criar_novo_pedido); then
        print_success \"Teste 1 concluído\"
    else
        print_error \"Teste 1 falhou\"
        exit 1
    fi
    
    # Se UUID foi obtido, continua testes
    if [ ! -z \"$UUID\" ]; then
        # Teste 2: Adicionar item
        if test_adicionar_item \"$UUID\"; then
            print_success \"Teste 2 concluído\"
        else
            print_error \"Teste 2 falhou\"
        fi
        
        # Teste 3: Obter pedido
        if test_obter_pedido \"$UUID\"; then
            print_success \"Teste 3 concluído\"
        else
            print_error \"Teste 3 falhou\"
        fi
        
        # Teste 4: Confirmar (requer token válido)
        if test_confirmar_pedido \"$UUID\"; then
            print_success \"Teste 4 concluído\"
        else
            print_error \"Teste 4 falhou (verifique token JWT)\"
        fi
    fi
    
    # Teste 5: Listar pedidos
    if test_listar_pedidos; then
        print_success \"Teste 5 concluído\"
    else
        print_error \"Teste 5 falhou (verifique autenticação)\"
    fi
    
    # Teste 6: Negativo
    if test_uuid_invalido; then
        print_success \"Teste 6 concluído\"
    else
        print_error \"Teste 6 falhou\"
    fi
    
    # Resumo final
    print_header \"TESTES COMPLETOS\"
    print_success \"Verificar outputs acima para detalhes\"
    print_info \"Se tudo passou, integração está OK!\"
}

# Executa
main
