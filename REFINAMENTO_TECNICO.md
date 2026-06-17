# 📘 Documentação de Refinamento Técnico  
## Projeto: OniBus Express — Sistema de Venda de Passagens Rodoviárias

---

## 🎯 Objetivo
Construir um MVP que permita **buscar e comprar passagens rodoviárias online**, garantindo regras de negócio essenciais e uma experiência de usuário fluida.  

---

## 🛠️ Arquitetura Geral

### Backend (.NET 8 + EF Core + PostgreSQL)
- **API RESTful** em ASP.NET Core Web API.
- **Camadas sugeridas**:
  - `Domain`: entidades e regras de negócio.
  - `Application`: casos de uso e serviços.
  - `Infrastructure`: persistência (EF Core), repositórios, migrations.
  - `Api`: controladores, endpoints, middlewares.
- **Banco de dados relacional** com migrations automáticas.
- **Docker Compose** para orquestrar API + DB.
- **Testes** com xUnit/NUnit + SQLite in-memory ou TestContainers.

### Frontend (React 18 + TypeScript)
- **SPA** servida via Nginx em Docker.
- **Gerenciamento de estado**: Redux Toolkit ou Zustand.
- **Testes** com React Testing Library + Jest/Vitest.
- **Estrutura modular**: `components/`, `pages/`, `services/`.

---

## 📑 Entidades e Relacionamentos

| Entidade | Campos | Observações |
|----------|--------|-------------|
| **Rota** | Origem, destino, duração | Base para viagens |
| **Viagem** | Rota, data/hora, preço, assentos | Deve validar disponibilidade |
| **Passageiro** | Nome, CPF, e-mail, nascimento | CPF validado |
| **Reserva** | Viagem, passageiro, assento, status, código | Código único e legível |

---

## 🔗 Endpoints Backend

- `GET /rotas` → listar rotas.
- `GET /viagens` → buscar por origem/destino/data.
- `GET /viagens/{id}` → detalhes + assentos.
- `POST /reservas` → criar reserva.
- `GET /reservas/{codigo}` → consultar reserva.
- `DELETE /reservas/{codigo}` → cancelar reserva.

---

## 📏 Regras de Negócio

- Assento não pode ser reservado se já ocupado.  
- Não reservar viagens já realizadas.  
- CPF validado (formato + dígito verificador).  
- Código de reserva único (`ABC-12345`).  
- Cancelamento permitido até **2h antes da partida**.  

---

## ✅ Testes Automatizados

- **Unitários**: validação de CPF, geração de código de reserva.  
- **Integração**: reserva de assento, cancelamento dentro do prazo.  
- **Ferramentas**: xUnit/NUnit + SQLite in-memory.  

---

## 🖥️ Telas Frontend

1. **Busca de Passagens**  
   - Formulário (origem, destino, data).  
   - Listagem de viagens com preço e vagas.  

2. **Seleção de Assento**  
   - Mapa visual (livre/ocupado/selecionado).  
   - Informações da viagem.  

3. **Dados do Passageiro e Confirmação**  
   - Formulário com validação.  
   - Resumo da compra.  
   - Tela de sucesso com código da reserva.  

4. **Consulta de Reserva (Bonus)**  
   - Campo para código.  
   - Exibir detalhes e opção de cancelamento.  

---

## 🐳 Docker

- `docker-compose.yml` deve subir:
  - API .NET  
  - Banco de dados (Postgres)  
  - Frontend React (Nginx)  
- Comando único:  
  ```bash
  docker-compose up --build

---

## 🚀 Pontos de Melhoria Futuro

- Autenticação de usuários (login/cadastro).
- Pagamentos integrados (gateway).
- Histórico de reservas.
- Notificações (e-mail/SMS).
- Observabilidade (logs, métricas, tracing).