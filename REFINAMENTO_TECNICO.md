# Documentacao de Refinamento Tecnico
## Projeto: OniBus Express

## Objetivo
Consolidar o estado atual do MVP de venda de passagens rodoviarias, registrando decisoes tecnicas, funcionalidades implementadas e ajustes recentes no projeto.

---

## Arquitetura Implementada

### Backend (.NET 8 + EF Core + PostgreSQL)
- API REST em ASP.NET Core 8.
- Arquitetura em camadas:
   - Domain: entidades, enums e regras de negocio.
   - Application: contratos e servicos de aplicacao.
   - Infrastructure: EF Core, DbContext, repositorio, migrations e seed.
   - Api: controllers, configuracao e middleware de excecao.
- Persistencia em PostgreSQL 16.
- Migrations versionadas em Infrastructure.

### Frontend (React 19 + TypeScript)
- SPA com Vite, servida por Nginx no container.
- Estado com hooks e Zustand no projeto.
- Estrutura modular em components, hooks, services, store, utils.

### Infraestrutura
- Docker Compose com 3 servicos: postgres, api e frontend.
- API exposta em http://localhost:8080.
- Frontend exposto em http://localhost:3000.

---

## Entidades e Relacionamentos

| Entidade | Campos principais | Observacoes |
|----------|-------------------|-------------|
| Rota | Origem, Destino, DuracaoMinutos | Base para composicao das viagens |
| Viagem | RotaId, DataHoraPartidaUtc, Preco, TotalAssentos | Relaciona rota e disponibilidade |
| Passageiro | Nome, Cpf, Email, DataNascimento | CPF validado por regra de dominio |
| Reserva | CodigoReserva, ViagemId, PassageiroId, NumeroAssento, Status | Status Ativa/Cancelada |

---

## Endpoints Disponiveis

- GET /rotas
- GET /viagens?origem=&destino=&data=
- GET /viagens/{id}
- POST /reservas
- GET /reservas/{codigo}
- DELETE /reservas/{codigo}

---

## Regras de Negocio Implementadas

- CPF obrigatorio e validado por digitos verificadores.
- Reserva de assento unico por viagem para status ativo.
- Nao permite reservar viagem ja realizada.
- Codigo de reserva no formato ABC-12345 com tentativa de unicidade.
- Cancelamento permitido ate 2 horas antes da partida.

---

## Seed e Dados Iniciais

- Seed cria 3 rotas base.
- Seed popula viagens para hoje e amanha (UTC).
- Total de viagens iniciais planejadas: 8 (4 por dia).
- Seed idempotente: evita duplicar viagem ja existente.

---

## Frontend: Fluxo e UX

### Fluxo principal
1. Busca de viagens por origem, destino e data.
2. Selecao de viagem.
3. Selecao de assento.
4. Preenchimento de dados do passageiro.
5. Confirmacao e exibicao de codigo da reserva.
6. Consulta/cancelamento por codigo.

### Tratamento de erros
- Erros agora sao exibidos em pop-up modal sobreposto.
- Titulo do pop-up: "Atencao!".
- Fechamento por:
   - Botao "Fechar".
   - Clique fora do conteudo do modal.
   - Tecla Esc.

---

## Testes

- Projeto de testes: OnibusExpress.Tests.
- Cobertura atual com testes unitarios e de integracao para:
   - Validacao de CPF.
   - Geracao de codigo de reserva.
   - Reserva e cancelamento.
   - Endpoints HTTP principais.
- Quantidade atual no projeto: 8 testes.

---

## Docker

- Servicos no compose:
   - postgres (healthcheck ativo)
   - api
   - frontend
- Comando de subida com build:

```bash
docker compose up --build -d
```

---

## Melhorias Futuras

- Autenticacao/autorizacao de usuarios.
- Pagamentos integrados.
- Historico de reservas por passageiro.
- Rate limiting e observabilidade (logs/metricas/tracing).
- Testes E2E de interface.