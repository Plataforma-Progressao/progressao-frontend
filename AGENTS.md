
You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

### Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `computed()` for derived state
- Set `changeDetection: ChangeDetectionStrategy.OnPush` in `@Component` decorator
- Prefer inline templates for small components
- Prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- When using external templates/styles, use paths relative to the component TS file.

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Use the `inject()` function instead of constructor injection

## Regras de dominio

### Status de atividades

- Toda atividade criada nasce com status `PENDING` e aguarda aprovação de um revisor (`EVALUATOR`).
- Apenas atividades `APPROVED` entram na pontuação do dashboard e no RAD.
- Revisores não podem aprovar/rejeitar as próprias atividades.
- Edição de atividade `APPROVED` ou `REJECTED` reenvia para `PENDING`.
- Docente sem revisor atribuído: atividades ficam `PENDING`, mas **não entram na fila** de nenhum revisor.

### Atribuição revisor-docente

- Relação **1 revisor → N docentes**; cada docente tem no máximo um revisor.
- Admin gerencia vínculos em `/admin/atribuicoes`.
- Revisor só vê/atua em atividades de docentes atribuídos a ele.

### Papéis (RBAC)

- `USER`: docente — área de progresso (dashboard, atividades, checklist, relatórios).
- `EVALUATOR`: revisor — dashboard, fila e checklist em `/avaliador`.
- `ADMIN`: administrador — dashboard, usuários, atribuições e barema em `/admin`.
- Um usuário pode ter múltiplos papéis (ex.: `USER` + `EVALUATOR`).

### Barema e pontuação

- Configuração ativa em `BaremaConfig` (meta global, ex.: 2000 pts).
- Regras por pilar em `BaremaCategoryRule`: `baseScore`, `workloadMultiplier`, `ceilingScore`, `minimumTarget`.
- Regras de classificação em `BaremaActivityRule`: `kind`, `keywords[]`, `fixedScore`, `priority`.
- Classificação automática (RF004) via keywords em título/descrição/tipo.
- Otimizador (RF008) quando ≥2 categorias distintas fazem match com confiança média/alta.
- Alertas de teto (RF007): notificação idempotente por `(userId, category, cycleId)` enquanto não lida.
