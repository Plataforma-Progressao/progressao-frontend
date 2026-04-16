# Plataforma Progressão Docente - Front-end

Este projeto utiliza Angular 21 com arquitetura baseada em features, lazy loading e componentes standalone (padrão do Angular 20+).

Objetivo deste README: deixar claro como contribuir com consistência de arquitetura, qualidade e manutenção.

## Stack

- Angular 21
- Angular Material 3
- Tailwind CSS v4
- TypeScript strict
- Vitest (via `ng test`) para testes unitários

## Estratégia de estilos (Tailwind + Material 3)

Este projeto segue padrão **Tailwind-first** com Angular Material 3.

### O que está ativo hoje

- Tailwind está habilitado globalmente em `src/styles.css` com `@import 'tailwindcss';`.
- O tema base do Material 3 está em `src/styles/material-theme.scss`.
- Tokens globais de layout/cores (CSS variables) ficam em `src/styles.css`.

### Quando usar Tailwind

- Layout, spacing, tipografia, sizing e responsividade no template.
- Composição rápida de UI em páginas e componentes de apresentação.
- Estilização utilitária sem criar regras CSS locais desnecessárias.

### Quando usar SCSS/CSS de componente

- Regras com pseudo-classes/pseudo-elementos mais complexas.
- Overrides específicos do Angular Material/MDC (tokens de estado, ripple, etc.).
- Media queries ou seletores mais elaborados que reduzam legibilidade no template.
- Extração de blocos grandes de estilo inline para melhorar manutenção.

### Regra prática do time

1. Priorizar Tailwind no HTML.
2. Manter SCSS/CSS local apenas para casos necessários.
3. Evitar duplicar utilitários Tailwind dentro de folhas de estilo locais.
4. Preservar consistência visual com os tokens globais e com o tema Material 3.

## Ambiente hospedado (Vercel)

- Aplicação: [https://progressao-frontend.vercel.app/](https://progressao-frontend.vercel.app/)
- API em produção: [https://progressao-backend.vercel.app/](https://progressao-backend.vercel.app/)

Em produção, `src/environments/environment.production.ts` aponta para a API e o front usa prefixo `/api` nas chamadas.

### Usuário padrão para testes

Se o seed da API foi executado no banco (local ou Supabase), o acesso de demonstração costuma ser:

- E-mail: `admin@progressao.uf.br`
- Senha: `Admin@123456`
- Papel: `ADMIN`

Esses valores vêm do ambiente da API (`ADMIN_EMAIL`, `ADMIN_PASSWORD` e `ADMIN_NAME`).
Não use essas credenciais padrão em produção real sem trocar senhas e segredos.

## Execução local

```bash
npm install
npm start
```

Aplicação em `http://localhost:4200/`.

## Scripts úteis

```bash
npm start       # sobe o app local
npm run build   # build de produção
npm test        # testes unitários
npm run lint    # lint
```

## Guia de contribuição

### Organização do código

- `src/app/core`: serviços singleton, auth, interceptors, layout global.
- `src/app/features`: funcionalidades por domínio (dashboard, atividades, etc).
- `src/app/shared`: componentes/utilitários reutilizáveis e sem regra de negócio específica.

Regra prática:

- Se é transversal para o app inteiro, vai em `core`.
- Se atende um domínio de negócio, vai na feature correspondente.
- Se é reaproveitável entre múltiplas features e não conhece o domínio, vai em `shared`.

### Criação de novos módulos/funcionalidades (feature-first)

Mesmo sem `NgModule`, tratamos cada feature como um “módulo funcional” com rota própria e lazy loading.

1. Crie a estrutura da feature em `src/app/features/nome-feature/`.
2. Crie um arquivo de rotas da feature: `nome-feature.routes.ts`.
3. Defina a página inicial da feature em `pages/...`.
4. Registre a rota lazy no agregador adequado (ex.: `features/authenticated/authenticated.routes.ts`).
5. Se necessário, crie `services`, `models` e `components` dentro da própria feature.

Exemplo de rota da feature:

```ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/nome-feature-home/nome-feature-home.page').then((m) => m.NomeFeatureHomePage),
  },
];
```

Exemplo de registro lazy no shell autenticado:

```ts
{
	path: 'nome-feature',
	loadChildren: () => import('../nome-feature/nome-feature.routes').then((m) => m.routes),
}
```

### Scaffolding recomendado

```bash
# Página da feature
ng generate component features/nome-feature/pages/nome-feature-home --skip-tests=false

# Componente reutilizável da feature
ng generate component features/nome-feature/components/filtro-rapido --skip-tests=false

# Serviço da feature
ng generate service features/nome-feature/services/nome-feature
```

## Padrões Angular obrigatórios

- Não adicionar `standalone: true` nos decorators (já é padrão do Angular 20+).
- Usar `ChangeDetectionStrategy.OnPush` em componentes.
- Usar `signals`, `computed` e `update/set` para estado local.
- Não usar `mutate` em signals.
- Usar `input()` e `output()` em vez de decorators (`@Input`/`@Output`).
- Evitar `@HostBinding` e `@HostListener`: use `host` no decorator.
- Preferir formulários reativos.
- Preferir templates simples, com pouca lógica de apresentação.
- Usar controle de fluxo nativo (`@if`, `@for`, `@switch`) no template.
- Preferir `async` pipe para consumo de observables no template.
- Evitar `ngClass` e `ngStyle`; prefira bindings nativos de `class` e `style`.
- Usar `inject()` em vez de constructor injection.
- Usar `NgOptimizedImage` para imagens estáticas (exceto base64 inline).
- Manter lazy loading para novas features.

## Boas práticas de código (TypeScript)

- Evitar `any`; usar `unknown` + narrowing.
- Tipar APIs públicas (serviços, modelos, funções exportadas).
- Priorizar imutabilidade (não mutar objetos/arrays em place).
- Tratar erros explicitamente (sem swallow silencioso).
- Nomes semânticos e funções pequenas/coesas.
- Sem `console.log` em código de produção.

## SOLID no contexto do projeto

- **S (Single Responsibility):** componentes focados em UI; regra de negócio em services/facades.
- **O (Open/Closed):** prefira extensão por composição e novos providers, sem reescrever comportamentos existentes.
- **L (Liskov):** contratos de interfaces devem ser respeitados por implementações.
- **I (Interface Segregation):** interfaces pequenas e específicas por domínio.
- **D (Dependency Inversion):** features dependem de abstrações (interfaces/tokens), não de implementações concretas quando houver variação de fonte de dados.

## Acessibilidade e UX (obrigatório)

- Cumprir WCAG AA.
- Deve passar em todas as verificações AXE.
- Garantir foco visível por teclado e ordem lógica de navegação.
- Sempre usar labels semânticos em campos de formulário.
- Garantir atributos ARIA quando aplicável.
- Validar contraste de cores e estados de erro/sucesso.

## Checklist antes de abrir PR

1. `npm run lint` sem erros.
2. `npm test` passando.
3. Lazy loading preservado para novas rotas de feature.
4. Sem hardcode de segredos, tokens ou credenciais.
5. Sem logs de dados sensíveis no browser.
6. Mudança documentada (README/descrição do PR quando necessário).

## Build de produção

```bash
npm run build
```

Saída em `dist/`.
