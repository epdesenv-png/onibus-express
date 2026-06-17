# OniBus Express

MVP para busca, compra e consulta de passagens rodoviárias com .NET 8 e React 18.

## Stack & Tecnologias

### Backend

- **ASP.NET Core 8** — Framework web robusto com alta performance.
- **Entity Framework Core 8** — ORM type-safe com migrações versionadas para PostgreSQL.
- **PostgreSQL 16** — Banco relacional com suporte a índices únicos.
- **xUnit + SQLite in-memory** — Testes rápidos sem dependência de banco real.
- **WebApplicationFactory** — Testes de integração HTTP sem servidor separado.

### Frontend

- **React 19** — UI componentizada com hooks.
- **TypeScript** — Type-safety em compilação.
- **Zustand** — Gerenciamento de estado global minimalista.
- **Vite** — Build tool rápido com HMR.
- **Nginx** — Reverse proxy para servir SPA em containers.

### Infraestrutura

- **Docker Compose** — Orquestração local (Postgres, API, Frontend).
- **CORS** — Configurado por ambiente.
- **Proxy Vite** — Em dev, frontend roteia `/rotas`, `/viagens`, `/reservas` para localhost:8080.
- **global.json** — Fixa SDK 8.0.422.

---

## Arquitetura

### Backend em camadas

```
OnibusExpress.Api (controllers, startup, middleware)
    ↓
OnibusExpress.Application (ReservaService, ConsultaService)
    ↓
OnibusExpress.Infrastructure (EF Core, DbContext, repositório, migrations)
    ↓
OnibusExpress.Domain (entidades, enums, regras de negócio)
```

**Fluxo:** Controller → Service (validações) → Repository (persistência) → Middleware (erros).

### Entidades

- **Rota** (1:n) **Viagem** — trecho e horário.
- **Viagem** (1:n) **Reserva** — passagem com n assentos.
- **Passageiro** (1:n) **Reserva** — múltiplas reservas por pessoa.
- **ReservaStatus** — Ativa | Cancelada.

### Frontend

- **Zustand store** — Estado centralizado (busca, viagem, assento, reserva).
- **api.ts** — HTTP client com tratamento de erro.
- **types.ts** — Tipos compartilhados.
- **UI em 4 passos** — Busca → Assento → Dados → Sucesso → Consulta.

---

## Fluxo de compra

1. **Busca** — `GET /viagens?origem=X&destino=Y&data=Z` → lista com assentos disponíveis.
2. **Detalhe** — `GET /viagens/{id}` → assentos ocupados para render visual.
3. **Reserva** — `POST /reservas` → código ABC-12345.
4. **Consulta** — `GET /reservas/{código}` → status e dados.
5. **Cancelamento** — `DELETE /reservas/{código}` → se > 2h antes partida.

---

## Regras de negócio implementadas

✅ **CPF validado** — Dígitos verificadores + rejeição de duplicatas.
✅ **Assento único** — Constraint UNIQUE em (ViagemId, NumeroAssento, Status=Ativa).
✅ **Viagem não realizada** — `DataHoraPartidaUtc > UtcNow`.
✅ **Código único** — ABC-12345 com retry até 20x.
✅ **Cancelamento com prazo** — Até 2h antes da partida.
✅ **Seed inicial** — 3 rotas + 8 viagens (hoje e amanhã).

---

## O que foi implementado

### Backend
- 5 projetos em camadas (Domain, Application, Infrastructure, Api, Tests)
- 4 entidades principais (Rota, Viagem, Passageiro, Reserva)
- 2 serviços de aplicação (ConsultaService, ReservaService)
- 6 endpoints REST
- Middleware de tratamento de exceções
- EF Core migrations versionadas
- Validadores de domínio (CPF, código de reserva)
- **8 testes** (unitários, integração, API HTTP)

### Frontend
- Interface em 4 passos (busca, assento, dados, sucesso)
- Visualização de assentos interativa
- Consulta e cancelamento de reservas
- Estado global persistente
- Tratamento de erros amigável
- Design responsivo
- Build otimizado <200KB

### Infraestrutura
- Docker Compose com healthcheck
- .dockerignore para acelerar builds
- CORS configurável
- Proxy Vite para dev

---

## O que ficou de fora

❌ Autenticação/Autorização (sem JWT)
❌ Rate limiting
❌ Paginação (retorna todas as viagens)
❌ Cache distribuído (sem Redis)
❌ Logging centralizado (console only)
❌ Testes E2E (Cypress/Playwright)
❌ Validação de email
❌ Auditoria completa (soft delete sem timestamps)
❌ OpenAPI comentado
❌ Multilíngue

---

## Como rodar

### Localmente sem Docker

#### Pré-requisitos
- .NET SDK 8.0.422 (ou versão mais recente; fixado em `global.json`)
- Node.js 22+
- PostgreSQL 16+
- Definir `ConnectionStrings__Postgres` no ambiente (ou User Secrets)

#### Backend

```powershell
cd backend

# Definir connection string (PowerShell)
$env:ConnectionStrings__Postgres="Host=localhost;Port=5432;Database=onibus_express;Username=postgres;Password=<SUA_SENHA>"

# (Opcional) Aplicar migrations
dotnet ef database update --project OnibusExpress.Infrastructure --startup-project OnibusExpress.Api

# Rodar testes
dotnet test

# Rodar API
dotnet run --project OnibusExpress.Api
```

API em http://localhost:8080.

#### Frontend

```powershell
cd frontend

npm install

# Dev mode com proxy para localhost:8080 (sem CORS)
npm run dev
```

Acesse http://localhost:5173 no navegador.

---

### Com Docker

#### Pré-requisitos
- Docker Desktop para Windows instalado (com backend WSL2 habilitado)
- Docker Engine em execução (Docker Desktop aberto)
- Arquivo `.env` na raiz do projeto (já existe neste ambiente local)

#### Setup inicial (Windows)

```powershell
# Validar se Docker está instalado
docker --version

# Validar plugin do Compose
docker compose version

# (Se ainda nao existir) criar .env a partir do exemplo
Copy-Item .env.example .env
```

Se `docker --version` falhar, instale o Docker Desktop e reinicie o terminal.

#### Startup

```powershell
docker compose up --build
```

Aguarde ~30s para Postgres (healthcheck) e API (migrations).

**Serviços:**
- Frontend: http://localhost:3000
- API Swagger: http://localhost:8080/swagger
- Postgres: localhost:5432 (credenciais definidas em `.env`)

#### Shutdown

```powershell
docker compose down
```

#### Logs úteis

```powershell
# Ver logs de todos os serviços
docker compose logs -f

# Ver logs apenas da API
docker compose logs -f api
```

---

## Como rodar testes

### Unitários (domínio)

```powershell
cd backend
dotnet test OnibusExpress.Tests/OnibusExpress.Tests.csproj -v minimal --filter "CpfValidatorTests|CodigoReservaGeneratorTests"
```

✓ Validação de CPF (dígitos verificadores)
✓ Geração de código de reserva

### Integração (serviços + repositório)

```powershell
dotnet test OnibusExpress.Tests/OnibusExpress.Tests.csproj -v minimal --filter "ReservaServiceIntegrationTests"
```

✓ Criar reserva com validações completas
✓ Cancelar reserva dentro do prazo
✓ SQLite in-memory isolado por teste

### API HTTP

```powershell
dotnet test OnibusExpress.Tests/OnibusExpress.Tests.csproj -v minimal --filter "ApiEndpointsIntegrationTests"
```

✓ GET /rotas
✓ GET /viagens
✓ POST /reservas
✓ DELETE /reservas/{codigo}
✓ Validação de CPF inválido (status 400)

### Todos

```powershell
cd backend
dotnet test OnibusExpress.sln -v minimal
```

**Resultado esperado:** ✅ **13 aprovados** em ~3 segundos.

---

## Endpoints

### GET /rotas
Lista de rotas (origem, destino, duração).

### GET /viagens?origem=X&destino=Y&data=2099-12-31
Viagens disponíveis com assentos disponíveis.

### GET /viagens/{id}
Detalhe de viagem com assentos ocupados.

### POST /reservas
```json
{
  "viagemId": 1,
  "numeroAssento": 5,
  "nome": "João Silva",
  "cpf": "52998224725",
  "email": "joao@email.com",
  "dataNascimento": "1990-01-15"
}
```

Retorna: `{ "codigo": "ABC-12345", "status": "Ativa", ... }`

### GET /reservas/{codigo}
Consulta reserva por código.

### DELETE /reservas/{codigo}
Cancela reserva (erro se < 2h da partida).

---

## Decisões de arquitetura

1. **EF Core + Migrations** — Type-safety, versionamento automático, rollback fácil.
2. **Zustand** — Minimalista (~2KB), ideal para estado simples; Redux seria overhead.
3. **SQLite in-memory** — Testes isolados, sem setup externo de banco.
4. **Proxy Vite** — Dev sem CORS; frontend/API em localhost diferentes.
5. **CORS em produção** — Frontend (nginx:3000) e API (dotnet:8080) separados no Docker.
6. **Nginx + React** — Separação; frontend deployável independentemente.
7. **WebApplicationFactory** — Testes HTTP sem spin-up de servidor separado.
8. **Healthcheck** — API aguarda Postgres pronto antes de iniciar.