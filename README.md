# Bora Viver — Backend

API REST do projeto **Bora Viver**, responsável por fornecer os dados e serviços utilizados pelo aplicativo Android disponível no repositório [Bora Viver — Android](https://github.com/lisscodes/bora-viver).

## Stack

- NestJS + TypeORM
- PostgreSQL
- Schema versionado em `sql/schema.sql`

## Modelo (resumo)

| Tabela | Papel |
|--------|--------|
| `usuario` | Entidade principal |
| `organizador` / `participante` | Papéis |
| `contato_emergencia` | Obrigatório ao participante |
| `local` | Espaço físico |
| `atividade` | Evento |
| `inscricao` | Interesse / participação |
| `registro_presenca` | Check-in / check-out |

## Subir o banco e a API

```bash
# 1) PostgreSQL (Docker)
docker compose up -d

# 2) Variáveis de ambiente
cp .env.example .env

# 3) API (Node 20+)
# Se aparecer SyntaxError com '??=', o terminal está no Node antigo.
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh" && nvm use
npm install
npm run start:dev
```

API em `http://localhost:3000`.

Conexão DBeaver (valores locais do `.env` / `.env.example`; o Compose lê essas variáveis):

- Host: `localhost` (`DB_HOST`)
- Port: `5433` (`DB_PORT`; mapeada do container)
- Database: `bora_viver` (`DB_NAME`)
- User: `bora` (`DB_USER`)
- Password: ver `DB_PASSWORD` no seu `.env` (placeholder local em `.env.example`)

## Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/events` | Lista eventos publicados |
| GET | `/events/nearby?lat=&lng=&radius=` | Eventos próximos (km) |
| GET | `/events/:id` | Detalhe |
| POST | `/events` | Criar |
| PATCH | `/events/:id` | Atualizar |
| DELETE | `/events/:id` | Remover |

## SQL do módulo

- `sql/schema.sql` — DDL (entidades, FKs, checks)
- `sql/seed.sql` — dados iniciais
- `sql/dml_exemplos.sql` — INSERT / UPDATE / DELETE / SELECT
