# Funcional evaluator feature
_Exported on 6/29/2026 at 19:49:16 GMT-3 from Cursor (3.9.16)_

---

**User**

preciso implementar feature de avaliador funcional no projeto

---

**Cursor**

Vou explorar o projeto para entender o que já existe sobre avaliador funcional e o que falta implementar.


Não há implementação de avaliador funcional ainda. Vou revisar a documentação do produto e conversas anteriores para entender o escopo esperado.


Não há implementação de avaliador funcional no projeto — só papéis `USER`/`ADMIN` e atividades auto-aprovadas. Preciso alinhar o escopo antes de montar o plano.


**Escopo do Avaliador Funcional**

> **Qual é a principal responsabilidade do avaliador funcional na plataforma?**
> - Revisar e aprovar/rejeitar atividades individuais dos docentes (fila de pendências por atividade) ✔
> - Avaliar o processo completo do docente (ciclo/RAD + checklist + atividades) — parecer por processo, não por atividade
> - Apenas acompanhar docentes (visualizar dados, relatórios e checklist) sem fluxo de aprovação/rejeição
> - Painel administrativo institucional (gestão de usuários, templates, comissões) — além ou em vez de avaliação

> **Como deve funcionar o ciclo de vida das atividades com o avaliador?**
> - Nova atividade nasce PENDING e só entra na pontuação/RAD após aprovação do avaliador ✔
> - Manter atividades auto-aprovadas; o avaliador atua só no nível de processo/ciclo (sem mudar o fluxo por atividade)
> - Docente mantém atividades aprovadas localmente; ao submeter o processo/ciclo, tudo vai para revisão do avaliador

Escopo definido: fila de atividades com aprovação/rejeição e novas atividades em `PENDING`. Vou mapear o código atual para montar o plano de implementação.


Tenho contexto suficiente para montar o plano com o escopo que você definiu.


---

**User**

importante:

precisamos de um usuário admin que vai gerenciar tanto usuarios docentes, quanto revisores. um docente pode ser revisor e docente ao mesmo tempo. cada um vai ter menus e visualizacoes especificas pra sua role 

---

**Cursor**

Atualizando o plano para RBAC multi-papel, painel admin e menus por role — um docente pode ser revisor ao mesmo tempo.


Atualizando o plano para RBAC multi-papel, painel admin e menus por role.


Atualizei o plano com os novos requisitos. Resumo das mudanças principais:

## O que mudou no plano

### RBAC multi-papel (em vez de papel único)
- `User.role` passa a ser `User.roles: Role[]` — um usuário pode ter `[USER, EVALUATOR]` ao mesmo tempo.
- Cadastro público continua criando só `[USER]`; o admin concede o papel de revisor.
- JWT, guards e tipos do frontend passam a trabalhar com array de papéis.

### Três áreas com menus próprios

| Papel | Área | Rotas |
|-------|------|-------|
| `USER` | Docente | Dashboard, Atividades, Checklist, Relatórios, Configurações |
| `EVALUATOR` | Revisor | Fila de avaliação (`/avaliador`) |
| `ADMIN` | Administração | Gestão de usuários (`/admin/usuarios`) |

Quem tem docente **e** revisor vê **duas seções** no menu (ex.: "Meu progresso" + "Avaliação"). Admin só vê a área admin se tiver `ADMIN` no array — não herda automaticamente as outras áreas.

### Painel admin (agora no escopo)
- `GET /api/admin/users` — listagem paginada
- `PATCH /api/admin/users/:id/roles` — atribuir/remover `USER`, `EVALUATOR`, `ADMIN`
- Frontend: tela com checkboxes de papéis por usuário

### Regra de auto-avaliação
Docente+revisor **não pode** aprovar as próprias atividades.

### Novos todos no plano
- `backend-multi-role-migration` — substitui o seed isolado de avaliador
- `backend-admin-module` — API de gestão de usuários
- `frontend-admin-feature` — UI de gestão de papéis

O plano completo está em `avaliador_funcional_255a1c6a.plan.md`. Se quiser incluir **criação de usuários pelo admin** (além de só atribuir papéis), posso acrescentar isso antes de executar. Para começar a implementação, é só pedir.

---

**User**

ok, entendo que vamos precisar de um painel admin também. isso precisa entrar no plano. para o painel admin já cria uma seed pra gente conseguir criar docentes e avaliadores e mostrar na prática depois. nao precisa se preocupar com testes unitários. refatore onde for necessário. use o mesmo design system que temos hoje 

---

**Cursor**

Vou revisar o plano e o design system atual para incorporar o painel admin, seeds de demonstração e as diretrizes que você pediu.


Atualizando o plano: painel admin com criação de usuários, seed de demonstração e diretrizes de design.


Atualizei o plano com o que você pediu. Principais mudanças:

## Painel admin (agora explícito e completo)

- **`POST /api/admin/users`** — criar docentes e/ou revisores pelo painel (não só editar papéis)
- **`GET` / `PATCH`** — listagem, detalhe e gestão de papéis
- Frontend em `/admin/usuarios` + `/admin/usuarios/novo` com formulário de criação

## Seed de demonstração

Cenário pronto após `prisma:seed`:

| Usuário | Papéis | Para testar |
|---------|--------|-------------|
| `admin@progressao.uf.br` | ADMIN | Painel admin |
| `docente1@` / `docente2@` | USER | Atividades PENDING na fila |
| `revisor@` | EVALUATOR | Fila de avaliação |
| `docente.revisor@` | USER + EVALUATOR | Menus duplos + bloqueio de auto-avaliação |

Inclui ciclos, checklists e atividades (PENDING, APPROVED, REJECTED) para demo ponta a ponta. Credenciais documentadas no README.

## Diretrizes adicionadas

- **Sem testes unitários** — fora do escopo; só ajuste mínimo se quebrar o build
- **Refatorar onde necessário** — principalmente `role` → `roles[]` e reutilizar `UserOnboardingService` no seed e na criação admin
- **Design system** — padrão de `atividades` (Tailwind + shared components + `mat-table`); formulários densos como `configuracoes`

## Removido do “fora do escopo”

- Criação de usuários pelo admin (agora está no MVP)
- “Só gestão de papéis de usuários existentes”

Quando quiser começar a implementação, é só pedir.

---

**User**

Implement the plan as specified, it is attached for your reference. Do NOT edit the plan file itself.

To-do's from the plan have already been created. Do not create them again. Mark them as in_progress as you work, starting with the first one. Don't stop until you have completed all the to-dos.

---

**Cursor**

Implementando o plano completo, começando pela migração multi-papel no backend.


Atualizando o ciclo de vida das atividades e criando os módulos admin e evaluator.


Backend compilou. Implementando o frontend.


Criando as features avaliador e admin.


Implementação concluída conforme o plano. Resumo do que foi entregue:

## Backend

**RBAC multi-papel**
- `User.role` → `User.roles[]` com `ADMIN`, `USER`, `EVALUATOR`
- JWT e `RolesGuard` atualizados para múltiplos papéis
- Migration: [`prisma/migrations/20260629120000_multi_role_and_pending_activities/`](progressao-backend/prisma/migrations/20260629120000_multi_role_and_pending_activities/)

**Ciclo de vida das atividades**
- Novas atividades nascem `PENDING`
- Edição de `APPROVED`/`REJECTED` reenvia para `PENDING` com histórico

**Módulo revisor** (`/api/evaluator/activities`)
- Fila, detalhe, aprovar, rejeitar, notificações, download de evidências
- Bloqueio de auto-avaliação

**Módulo admin** (`/api/admin/users`)
- Listagem paginada, criar usuário, editar papéis

**Seed de demo** — após `npm run prisma:seed`:

| E-mail | Papéis |
|--------|--------|
| `admin@progressao.uf.br` | ADMIN |
| `docente1@progressao.uf.br` | USER |
| `docente2@progressao.uf.br` | USER |
| `revisor@progressao.uf.br` | EVALUATOR |
| `docente.revisor@progressao.uf.br` | USER + EVALUATOR |

Senha padrão: `Seed@123456` (ou `SEED_PASSWORD` / `ADMIN_PASSWORD`)

## Frontend

**Auth e navegação**
- `roles[]`, `roleGuard`, redirect pós-login por papel
- Menu em seções: Meu progresso / Avaliação / Administração

**`/avaliador`** — fila + revisão (aprovar/rejeitar)

**`/admin/usuarios`** — listagem, criar usuário, editar papéis

**UX docente** — mensagens “enviada para avaliação”, filtros de status atualizados

## Para testar localmente

```bash
# Backend
cd progressao-backend
npm run prisma:migrate:dev   # ou migrate deploy
npm run prisma:seed
npm run start:dev

# Frontend
cd progressao-frontend
npm start
```

**Fluxo sugerido:** login como `revisor@...` → aprovar atividades do seed → login como `docente1@...` → ver status no dashboard → login como `admin@...` → gerenciar usuários.

Backend e frontend compilam com sucesso. Documentação atualizada em `AGENTS.md`, `FUNCIONALIDADES.md` e `README.md` do backend.

