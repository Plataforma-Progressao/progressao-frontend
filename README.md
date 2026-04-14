# Plataforma Progressão Docente - Digital Curator

Este projeto foi gerado com [Angular CLI](https://github.com/angular/angular-cli) versão 21.2.3.
O design system adotado é **Digital Curator**, utilizando Angular Material 3 e Tailwind CSS v4 para garantir produtividade, alta fidelidade e acessibilidade.

## Stack de UI e Acessibilidade

- **Angular 21 Standalone Components:** O projeto foi atualizado para não usar `standalone: true` de forma redundante (padrão v21).
- **Tailwind CSS v4:** Para posicionamento e espaçamento ágeis integrados aos design tokens.
- **Angular Material 3:** Para formulários robustos, elevações e componentes padronizados baseados no Material Design 3.
- **Tokens Semânticos Globais:** Definidos em `src/styles/tokens.css` e referenciados via Tailwind em `theme`.
- **Tipografia:** Adota a fonte **Manrope** definida em `src/styles/typography.css`.
- **Acessibilidade AA:** Formulários sempre com rótulos semânticos, gestão nativa de contraste e estados de foco bem definidos.

## Development server

Para subir localmente:

```bash
npm start
```
Após executar, abra [http://localhost:4200/](http://localhost:4200/). 

## Rodando testes

Tests automatizados utilizam o [Karma/Jasmine](https://karma-runner.github.io/):

```bash
npm test
```

## Estrutura do Roteamento

O roteamento já nasce utilizando *lazy loading*.
A rota default (que é `/login`) carrega a _feature_ de `Auth` (código em `src/app/features/auth/`).

## Adicionando componentes (scaffolding)

```bash
ng generate component components/nome-do-componente
```

## Build de Produção

```bash
npm run build
```
O diretório compilado é o `dist/`. O angular.json contém os budgets adequados.
