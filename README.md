# G Events — Backend (NestJS + SQLite)

API REST do Capstone **G Events**, com modelagem SQL do Módulo 3 e geolocalização na entidade `atividade`.

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
| `atividade` | Evento (**com `latitude` e `longitude`**) |
| `inscricao` | Interesse / participação |
| `registro_presenca` | Check-in / check-out |

## Subir a API

```bash
export NVM_DIR="$HOME/.nvm" && . "$NVM_DIR/nvm.sh" && nvm use 20
npm install
npm run start:dev
```

API em `http://localhost:3000`.

## Endpoints (contrato do app Android)

| Método | Rota | Descrição |
|--------|------|-----------|
| GET | `/events` | Lista eventos publicados |
| GET | `/events/nearby?lat=&lng=&radius=` | Busca por geolocalização (km) |
| GET | `/events/:id` | Detalhe |
| POST | `/events` | Criar |
| PATCH | `/events/:id` | Atualizar |
| DELETE | `/events/:id` | Remover |

JSON no formato `RemoteEvent` do frontend (`id`, `title`, `description`, `date`, `location_name`, `latitude`, `longitude`, `image_url`).

## SQL do módulo

- `sql/schema.sql` — DDL (entidades, FKs, checks, índice geo)
- `sql/seed.sql` — dados iniciais
- `sql/dml_exemplos.sql` — INSERT / UPDATE / DELETE / SELECT

## App Android

No emulador, a base URL é `http://10.0.2.2:3000/` (apontando para o host). Cleartext HTTP está liberado no `AndroidManifest`.
