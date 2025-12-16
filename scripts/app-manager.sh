#!/bin/bash

# TekookaaDash Application Manager
# Script para gerenciar a aplicação: iniciar, parar, reiniciar e outras operações úteis

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configurações
APP_PORT="8537"
APP_HOST="0.0.0.0"
APP_URL="http://127.0.0.1:${APP_PORT}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
PID_FILE="${PROJECT_DIR}/.app.pid"
LOG_FILE="${PROJECT_DIR}/app.log"

# Funções de print
print_header() {
    echo -e "${BLUE}=== TekookaaDash Manager ===${NC}"
    echo -e "${BLUE}Port: ${APP_PORT} | Host: ${APP_HOST}${NC}\n"
}

print_success() {
    echo -e "${GREEN}✓ $1${NC}"
}

print_error() {
    echo -e "${RED}✗ $1${NC}"
}

print_info() {
    echo -e "${YELLOW}ℹ $1${NC}"
}

# Verifica se a porta está em uso
check_port() {
    if ss -tlnp 2>/dev/null | grep -q ":${APP_PORT} "; then
        return 0
    else
        return 1
    fi
}

# Obtém o PID do processo na porta
get_process_pid() {
    ss -tlnp 2>/dev/null | grep ":${APP_PORT} " | grep -oP 'pid=\K[0-9]+' | head -1 || echo ""
}

# Mata todos os processos next
kill_next_processes() {
    pkill -f "next dev" 2>/dev/null || true
    pkill -f "next-router-worker" 2>/dev/null || true
    sleep 1
}

# Inicia a aplicação
start_app() {
    print_header
    
    if check_port; then
        print_error "Porta ${APP_PORT} já está em uso!"
        local pid=$(get_process_pid)
        if [ -n "$pid" ]; then
            print_info "PID do processo: $pid"
            read -p "Deseja matar o processo? (s/n) " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Ss]$ ]]; then
                kill_next_processes
                fuser -k ${APP_PORT}/tcp 2>/dev/null || true
                print_success "Processo morto"
                sleep 2
            else
                return 1
            fi
        fi
    fi
    
    print_info "Iniciando aplicação na porta ${APP_PORT}..."
    cd "$PROJECT_DIR"
    
    # Inicia em background
    nohup npx next dev --turbopack -p ${APP_PORT} > "$LOG_FILE" 2>&1 &
    local NEW_PID=$!
    echo $NEW_PID > "$PID_FILE"
    
    print_info "Aguardando inicialização..."
    
    # Loop para verificar se iniciou
    for i in {1..15}; do
        sleep 1
        if check_port; then
            echo ""
            print_success "Aplicação iniciada com sucesso!"
            print_info "URL Local: http://localhost:${APP_PORT}"
            print_info "URL Rede:  http://${APP_HOST}:${APP_PORT}"
            print_info "PID: $NEW_PID"
            print_info "Log: $LOG_FILE"
            return 0
        fi
        echo -n "."
    done
    
    echo ""
    print_error "Timeout ao iniciar aplicação. Verifique o log:"
    tail -n 30 "$LOG_FILE"
    return 1
}

# Para a aplicação
stop_app() {
    print_header
    
    print_info "Parando aplicação..."
    
    # Mata processos next
    kill_next_processes
    
    # Libera a porta
    fuser -k ${APP_PORT}/tcp 2>/dev/null || true
    
    # Remove PID file
    rm -f "$PID_FILE"
    
    sleep 1
    
    if check_port; then
        print_error "Falha ao parar. Forçando..."
        fuser -k -9 ${APP_PORT}/tcp 2>/dev/null || true
        sleep 1
    fi
    
    if ! check_port; then
        print_success "Aplicação parada com sucesso"
    else
        print_error "Não foi possível parar a aplicação"
        return 1
    fi
}

# Reinicia a aplicação
restart_app() {
    print_header
    print_info "Reiniciando aplicação..."
    stop_app
    sleep 2
    start_app
}

# Mostra status
status_app() {
    print_header
    
    if check_port; then
        local pid=$(get_process_pid)
        print_success "Aplicação está RODANDO"
        print_info "PID: $pid"
        print_info "Porta: ${APP_PORT}"
        print_info "URL: ${APP_URL}"
        
        # Verifica se responde
        if curl -s --max-time 5 "$APP_URL" > /dev/null 2>&1; then
            print_success "Aplicação está respondendo"
        else
            print_info "Aplicação ainda inicializando ou não responde"
        fi
    else
        print_error "Aplicação NÃO está rodando"
    fi
}

# Mostra logs em tempo real
logs_app() {
    print_header
    print_info "Exibindo logs (Ctrl+C para sair)..."
    echo ""
    tail -f "$LOG_FILE"
}

# Mostra últimas linhas do log
logs_tail() {
    print_header
    print_info "Últimas 50 linhas do log:"
    echo ""
    tail -n 50 "$LOG_FILE"
}

# Limpa logs
clear_logs() {
    print_header
    print_info "Limpando logs..."
    : > "$LOG_FILE"
    print_success "Logs limpos"
}

# Mata processo na porta (force kill)
kill_port() {
    print_header
    
    print_info "Matando todos os processos na porta ${APP_PORT}..."
    
    kill_next_processes
    fuser -k -9 ${APP_PORT}/tcp 2>/dev/null || true
    
    rm -f "$PID_FILE"
    
    sleep 1
    
    if ! check_port; then
        print_success "Porta ${APP_PORT} liberada"
    else
        print_error "Falha ao liberar porta"
        return 1
    fi
}

# Verifica dependências
check_dependencies() {
    print_header
    print_info "Verificando dependências..."
    
    local missing=0
    
    if ! command -v bun &> /dev/null; then
        print_error "bun não está instalado"
        missing=1
    else
        print_success "bun: $(bun --version)"
    fi
    
    if ! command -v node &> /dev/null; then
        print_error "node não está instalado"
        missing=1
    else
        print_success "node: $(node --version)"
    fi
    
    if ! command -v npx &> /dev/null; then
        print_error "npx não está instalado"
        missing=1
    else
        print_success "npx: $(npx --version)"
    fi
    
    if [ $missing -eq 0 ]; then
        print_success "Todas as dependências instaladas!"
    else
        return 1
    fi
}

# Mostra porta em uso
show_ports() {
    print_header
    print_info "Portas em uso pela aplicação:"
    echo ""
    lsof -i :${APP_PORT} 2>/dev/null || print_info "Nenhuma porta em uso"
}

# Menu de ajuda
show_help() {
    echo -e "\n${BLUE}Uso: $0 <comando>${NC}\n"
    echo "Comandos disponíveis:"
    echo -e "  ${GREEN}start${NC}           - Inicia a aplicação"
    echo -e "  ${GREEN}stop${NC}            - Para a aplicação"
    echo -e "  ${GREEN}restart${NC}         - Reinicia a aplicação"
    echo -e "  ${GREEN}status${NC}          - Mostra status da aplicação"
    echo -e "  ${GREEN}logs${NC}            - Mostra logs em tempo real"
    echo -e "  ${GREEN}logs-tail${NC}       - Mostra últimas 50 linhas do log"
    echo -e "  ${GREEN}clear-logs${NC}      - Limpa arquivo de log"
    echo -e "  ${GREEN}kill-port${NC}       - Mata processo na porta ${APP_PORT}"
    echo -e "  ${GREEN}check-deps${NC}      - Verifica dependências"
    echo -e "  ${GREEN}show-ports${NC}      - Mostra portas em uso"
    echo -e "  ${GREEN}help${NC}            - Mostra esta mensagem"
    echo ""
}

# Processa argumentos
case "${1:-help}" in
    start)
        start_app
        ;;
    stop)
        stop_app
        ;;
    restart)
        restart_app
        ;;
    status)
        status_app
        ;;
    logs)
        logs_app
        ;;
    logs-tail)
        logs_tail
        ;;
    clear-logs)
        clear_logs
        ;;
    kill-port)
        kill_port
        ;;
    check-deps)
        check_dependencies
        ;;
    show-ports)
        show_ports
        ;;
    help|--help|-h)
        show_help
        ;;
    *)
        print_error "Comando desconhecido: $1"
        show_help
        exit 1
        ;;
esac
