# Bora Viver — Backend

API REST do projeto **Bora Viver**, responsável por fornecer os dados e serviços utilizados pelo aplicativo Android disponível no repositório [Bora Viver — Android](https://github.com/lisscodes/bora-viver).

## Stack

- NestJS + TypeORM
- SQLite (`data/gevents.sqlite`)
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

## Subir a API

```bash
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh" && nvm use 20
npm install
npm run start:dev
```

API em `http://localhost:3000`.

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
