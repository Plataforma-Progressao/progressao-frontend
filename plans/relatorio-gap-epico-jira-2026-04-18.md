# Relatório Analítico do Épico - Plataforma de Progressão Docente (UF)

Data da análise: 18/04/2026  
Escopo analisado: `plataforma-progressao-front` + `plataforma-progressao-backend`

## 1. Objetivo do documento

Este relatório consolida, com base em análise de código-fonte, o status de implementação da Plataforma de Progressão Docente em relação ao épico funcional proposto.

Ele está dividido em:

1. Diagnóstico do que já foi implementado.
2. Diagnóstico técnico do que ainda não foi implementado (gaps).
3. Backlog detalhado em formato de tasks Jira (frontend + backend), com descrições técnicas, critérios de aceite, dependências e prioridade.

## 2. Metodologia de análise

A análise foi realizada por leitura direta de rotas, módulos, serviços, DTOs, schema de banco, testes e bootstrap de aplicação.

Principais evidências usadas:

- Frontend:
  - `src/app/app.routes.ts`
  - `src/app/features/authenticated/authenticated.routes.ts`
  - `src/app/features/atividades/atividades.routes.ts`
  - `src/app/features/checklist/checklist.routes.ts`
  - `src/app/features/relatorios/relatorios.routes.ts`
  - `src/app/features/historico/historico.routes.ts`
  - `src/app/features/configuracoes/configuracoes.routes.ts`
  - `src/app/features/dashboard/pages/dashboard-home/dashboard-home.page.ts`
  - `src/app/features/dashboard/dashboard-api.service.ts`
  - `src/app/core/auth/auth-state.service.ts`
  - `src/app/core/auth/auth-api.service.ts`
  - `src/app/features/auth/pages/signup/signup.page.ts`

- Backend:
  - `src/app.module.ts`
  - `src/main.ts`
  - `src/auth/auth.controller.ts`
  - `src/auth/auth.service.ts`
  - `src/auth/dto/register.dto.ts`
  - `src/users/users.controller.ts`
  - `src/users/users.service.ts`
  - `src/dashboard/dashboard.controller.ts`
  - `src/dashboard/dashboard.service.ts`
  - `src/common/interceptors/transform-response.interceptor.ts`
  - `prisma/schema.prisma`

## 3. Resumo executivo

### 3.1 Situação geral

A plataforma está com **fundação técnica sólida de autenticação, estrutura de navegação e shell autenticado**, porém os épicos de negócio (atividades, pontuação real, documentos, relatório RAD e inteligência) ainda não foram implementados de forma funcional ponta a ponta.

### 3.2 Percentual qualitativo por bloco

- Base de produto (infra de app, autenticação, layout, proteção de rotas): **Alta maturidade**.
- Domínio de progressão docente (core de negócio): **Baixa maturidade**.
- Integração entre frontend e backend para dados de progressão: **Inicial/parcial**.

## 4. Diagnóstico detalhado - feito vs não feito por épico

## 4.1 Épico 1 - Gestão de Atividades

### O que já foi feito

- Existe rota de navegação para o domínio de atividades no frontend:
  - `src/app/features/authenticated/authenticated.routes.ts` (`path: 'atividades'`).
- Existe feature dedicada no frontend:
  - `src/app/features/atividades/`.

### O que ainda não foi feito

- A tela de atividades está em placeholder e não possui CRUD real.
  - Evidência: `src/app/features/atividades/atividades.routes.ts` carrega `PlaceholderPageComponent`.
- Não existem modelos de dados de atividade no frontend para listagem, filtro, criação, edição e exclusão.
- Não existe módulo backend de atividades (`src/atividades` inexiste).
- Não existem endpoints REST para atividades.
- Não existe modelo Prisma para atividade no schema atual.

### Gap de negócio

O produto não possui ainda o núcleo de entrada de produção acadêmica/docente por atividade, inviabilizando cálculo real e relatório final.

## 4.2 Épico 2 - Sistema de Pontuação

### O que já foi feito

- O frontend já consome endpoint de dashboard:
  - `src/app/features/dashboard/dashboard-api.service.ts` (`GET /api/dashboard/home`).
- O backend já expõe endpoint de home do dashboard:
  - `src/dashboard/dashboard.controller.ts` (`GET /dashboard/home`).
- Existe contrato tipado de score/carreira/pilares no FE e no BE:
  - `src/app/features/dashboard/models/dashboard-home.models.ts`
  - `src/dashboard/dto/dashboard-home.dto.ts`

### O que ainda não foi feito

- A pontuação retornada é hardcoded no backend, sem cálculo por dados reais.
  - Evidência: `src/dashboard/dashboard.service.ts` retorna valores fixos (`1420`, `2000`, percentuais fixos e notificações fixas).
- Não existe engine de regras (barema parametrizável por instituição).
- Não existe persistência de lançamentos de pontuação por atividade.
- Não existe simulação de cenários com recomputação de score.

### Gap de negócio

Existe visualização, mas sem inteligência de cálculo real. O docente vê score, porém sem rastreabilidade por evidência/atividade.

## 4.3 Épico 3 - Documentos

### O que já foi feito

- Existe rota e espaço de feature de checklist e relatórios (que no futuro podem consumir estado documental):
  - `src/app/features/checklist/`
  - `src/app/features/relatorios/`

### O que ainda não foi feito

- Não existe tela funcional de upload/listagem documental.
- Não existe backend para documentos (upload, metadados, vínculo com atividade).
- Não existe storage adapter (S3, GCS ou storage institucional).
- Não existe schema Prisma para `Document`.
- Não existe validação de tipo de arquivo, tamanho, retenção e auditoria.

### Gap de negócio

A centralização documental, uma dor principal do problema original, ainda não foi implementada.

## 4.4 Épico 4 - Geração de Relatório (RAD)

### O que já foi feito

- Existe estrutura de rota para relatórios no frontend.
  - `src/app/features/relatorios/relatorios.routes.ts`

### O que ainda não foi feito

- A rota também está em placeholder.
- Não existe pipeline de agregação de dados para RAD.
- Não existe template institucional configurável.
- Não existe exportação PDF no frontend nem no backend.
- Não existe endpoint para geração/download de relatório.

### Gap de negócio

A proposta de valor final (geração automatizada do RAD pronto para submissão) ainda não existe no produto atual.

## 4.5 Épico 5 - Inteligência e Sugestões

### O que já foi feito

- Não há implementação real detectada deste épico.

### O que ainda não foi feito

- Não existe recomendador de enquadramento de atividade.
- Não existe validador de inconsistência de classificação.
- Não existe otimizador de pontuação.
- Não existe serviço de regras assistidas ou IA.

### Gap de negócio

Diferencial estratégico do produto ainda ausente.

## 4.6 Requisitos transversais

### 4.6.1 Autenticação e segurança

#### Já feito

- Autenticação robusta com JWT + refresh token.
  - `src/auth/auth.controller.ts`
  - `src/auth/auth.service.ts`
- Cadastro completo com dados acadêmicos e validações fortes.
  - `src/auth/dto/register.dto.ts`
- Guardas de autorização no backend (JWT + roles).
  - `src/common/guards/jwt-auth.guard.ts`
  - `src/common/guards/roles.guard.ts`
- Interceptor de envelope padrão de resposta no backend.
  - `src/common/interceptors/transform-response.interceptor.ts`
- Estado de sessão com signal no frontend.
  - `src/app/core/auth/auth-state.service.ts`
- Interceptors frontend para auth header e refresh (existem specs no projeto).

#### Não feito

- Fluxo de recuperação de senha sem integração de envio real por e-mail/transporte (token é gerado, mas não há mailer oficial integrado).

### 4.6.2 Estrutura de navegação e UX de base

#### Já feito

- Shell autenticado implementado e organizado.
  - `src/app/core/layout/authenticated-shell/authenticated-shell.component.ts`
- Lazy loading das features por rota.
  - `src/app/app.routes.ts`
  - `src/app/features/authenticated/authenticated.routes.ts`

#### Não feito

- Features core de negócio ainda substituídas por páginas placeholder.

### 4.6.3 Banco e domínio

#### Já feito

- Prisma configurado e modelagem de usuário consolidada.
  - `prisma/schema.prisma`
- Campos de perfil docente já existem no user.

#### Não feito

- Não existem entidades de domínio essenciais: atividade, documento, barema, regra de pontuação, submissão de relatório, workflow de validação.

## 5. Avaliação técnica por camada

## 5.1 Frontend

### Pontos fortes

- Arquitetura por features e lazy loading consistente.
- Uso de Angular moderno (signals, resource, standalone por padrão).
- Camada de auth bem separada (state/api/storage).
- Base de componentes compartilhados para formulário e botões.

### Fragilidades atuais

- Features de negócio principais não implementadas.
- Dashboard com dependência de payload atualmente mockado no backend.
- Diretório de `card` base existe mas está vazio (`src/app/shared/components/base/card/`).

## 5.2 Backend

### Pontos fortes

- Módulos de auth/users/dashboard organizados.
- DTOs com validação consistente.
- Segurança base boa (hash, guards, throttling global + por rota).
- Middleware de logging e envelope de resposta padronizado.

### Fragilidades atuais

- `dashboard.service` ainda não calcula dados reais.
- Domínio de progressão está concentrado apenas em dados de usuário; faltam entidades centrais.
- Ausência de módulos de atividade/documento/relatório/workflow.

## 6. Backlog Jira proposto (detalhado)

Observação: IDs abaixo são sugestivos para facilitar importação inicial. Ajustar prefixo conforme projeto Jira real.

Legenda de prioridade:

- P0: crítico para viabilizar core do produto
- P1: alto impacto funcional
- P2: melhoria relevante

---

## EPICO 1 - Gestão de Atividades (Frontend + Backend)

### PPD-BE-ATV-001 - Modelar domínio de atividades no Prisma

- Tipo: Task
- Prioridade: P0
- Camada: Backend
- Descrição:
  - Criar entidades de domínio no `schema.prisma` para suportar o ciclo completo de atividades docentes.
  - Entidades mínimas:
    - `Activity`
    - `ActivityCategory`
    - `ActivityEvidence` (opcional inicial, se documento for separado)
  - Campos fundamentais de `Activity`:
    - `id`, `userId`, `categoryId`, `title`, `description`, `startDate`, `endDate`, `status`, `institutionContext`, `createdAt`, `updatedAt`.
  - Definir índices para consulta por `userId`, `status`, `date range`.
- Critérios de aceite:
  - Migration criada e aplicável em ambiente local.
  - Relacionamento `User 1:N Activity` funcional.
  - Enum de status de atividade definido.
- Dependências:
  - Nenhuma.

### PPD-BE-ATV-002 - Criar módulo Nest de atividades com CRUD completo

- Tipo: Task
- Prioridade: P0
- Camada: Backend
- Descrição:
  - Criar `ActivitiesModule`, `ActivitiesController`, `ActivitiesService`.
  - Implementar endpoints:
    - `POST /api/activities`
    - `GET /api/activities`
    - `GET /api/activities/:id`
    - `PATCH /api/activities/:id`
    - `DELETE /api/activities/:id`
  - Garantir isolamento por usuário autenticado (multi-tenant por owner).
- Critérios de aceite:
  - CRUD funcional com persistência real.
  - Usuário não consegue acessar atividade de outro usuário.
  - DTOs com validação forte.
- Dependências:
  - PPD-BE-ATV-001.

### PPD-BE-ATV-003 - Implementar filtros e paginação de atividades

- Tipo: Task
- Prioridade: P1
- Camada: Backend
- Descrição:
  - Adicionar query params para busca/filtro:
    - categoria, período, status, texto livre.
  - Incluir paginação e ordenação.
  - Incluir metadados (`total`, `page`, `limit`).
- Critérios de aceite:
  - Endpoint de listagem retorna envelope com meta de paginação.
  - Filtros combinados com performance aceitável.
- Dependências:
  - PPD-BE-ATV-002.

### PPD-FE-ATV-001 - Implementar tela de listagem de atividades

- Tipo: Task
- Prioridade: P0
- Camada: Frontend
- Descrição:
  - Substituir placeholder de `atividades` por página real.
  - Exibir tabela/cards com paginação, filtros e estados vazios.
  - Consumir API real de atividades.
- Critérios de aceite:
  - Rota `/atividades` não usa mais `PlaceholderPageComponent`.
  - Carregamento, erro e estado vazio tratados.
  - Filtro por categoria e período funcionando.
- Dependências:
  - PPD-BE-ATV-002, PPD-BE-ATV-003.

### PPD-FE-ATV-002 - Implementar formulário de criação/edição de atividade

- Tipo: Task
- Prioridade: P0
- Camada: Frontend
- Descrição:
  - Construir formulário reativo para atividade.
  - Campos mínimos: título, categoria, período, descrição, vinculação com documentação.
  - Suporte a criação e edição no mesmo fluxo.
- Critérios de aceite:
  - Validações de front alinhadas ao DTO backend.
  - Mensagens de erro e sucesso claras.
  - Fluxo de edição com preload de dados.
- Dependências:
  - PPD-BE-ATV-002.

### PPD-FE-ATV-003 - Implementar exclusão com confirmação e feedback

- Tipo: Task
- Prioridade: P1
- Camada: Frontend
- Descrição:
  - Adicionar ação de delete com modal de confirmação.
  - Atualizar listagem sem recarregar página (estado reativo).
- Critérios de aceite:
  - Exclusão remove item da lista imediatamente após resposta 200/204.
  - Falha no delete apresenta feedback amigável.
- Dependências:
  - PPD-FE-ATV-001.

### PPD-QA-ATV-001 - Cobrir CRUD de atividades com testes unitários e integração

- Tipo: Task
- Prioridade: P1
- Camada: FE+BE
- Descrição:
  - Backend: specs de service/controller e cenário de autorização.
  - Frontend: specs de page/form/service.
- Critérios de aceite:
  - Cobertura dos fluxos de sucesso, validação e autorização.
  - Pipeline de testes passando para novos arquivos.
- Dependências:
  - Tasks de implementação do épico.

---

## EPICO 2 - Sistema de Pontuação

### PPD-BE-PONT-001 - Modelar barema configurável por instituição

- Tipo: Task
- Prioridade: P0
- Camada: Backend
- Descrição:
  - Criar entidades:
    - `ScoringRule`
    - `ScoringRuleVersion`
    - `InstitutionProfile` (ou equivalente)
  - Permitir parametrização por categoria, tipo de atividade, teto e multiplicadores.
- Critérios de aceite:
  - Regras persistidas e versionadas.
  - Mecanismo de seleção da versão ativa por instituição.
- Dependências:
  - PPD-BE-ATV-001.

### PPD-BE-PONT-002 - Implementar engine de cálculo de pontuação

- Tipo: Task
- Prioridade: P0
- Camada: Backend
- Descrição:
  - Desenvolver serviço de cálculo determinístico baseado em atividades + regras.
  - Retornar breakdown por pilar:
    - ensino, pesquisa, extensão, gestão.
  - Retornar score total e score elegível para progressão.
- Critérios de aceite:
  - Mesmo input gera sempre mesmo output (idempotência).
  - Testes cobrindo múltiplos cenários de regra.
- Dependências:
  - PPD-BE-PONT-001, PPD-BE-ATV-002.

### PPD-BE-PONT-003 - Substituir dashboard mockado por dados calculados

- Tipo: Task
- Prioridade: P0
- Camada: Backend
- Descrição:
  - Refatorar `src/dashboard/dashboard.service.ts` para consumir engine real.
  - Remover valores fixos atuais de score, pillars e notificações estáticas.
- Critérios de aceite:
  - Endpoint `/api/dashboard/home` responde com dados derivados de atividades reais.
  - Não há literais de score hardcoded no service.
- Dependências:
  - PPD-BE-PONT-002.

### PPD-FE-PONT-001 - Adaptar dashboard para score dinâmico com breakdown

- Tipo: Task
- Prioridade: P0
- Camada: Frontend
- Descrição:
  - Ajustar cards de dashboard para refletir cálculo real por pilar.
  - Exibir indicadores de meta e teto por categoria.
- Critérios de aceite:
  - Dashboard exibe dados reais do usuário autenticado.
  - Comportamento consistente para usuário sem atividades (zero-state).
- Dependências:
  - PPD-BE-PONT-003.

### PPD-FE-PONT-002 - Implementar simulador de pontuação

- Tipo: Story
- Prioridade: P1
- Camada: Frontend
- Descrição:
  - Criar interface de simulação "what-if" para projeção de score.
  - Permitir inserir atividade hipotética sem persistir.
  - Exibir impacto no total e nos pilares.
- Critérios de aceite:
  - Simulação não altera dados persistidos.
  - UI mostra comparativo "atual vs simulado".
- Dependências:
  - PPD-BE-PONT-004.

### PPD-BE-PONT-004 - Endpoint de simulação sem persistência

- Tipo: Task
- Prioridade: P1
- Camada: Backend
- Descrição:
  - Criar endpoint `POST /api/scoring/simulate` com payload de atividades hipotéticas.
  - Reutilizar engine de cálculo sem salvar em banco.
- Critérios de aceite:
  - Retorno inclui score total simulado e deltas por pilar.
  - Endpoint protegido por JWT.
- Dependências:
  - PPD-BE-PONT-002.

### PPD-QA-PONT-001 - Testes de regressão de cálculo

- Tipo: Task
- Prioridade: P1
- Camada: Backend
- Descrição:
  - Construir suíte orientada a regras para evitar regressão de barema.
  - Casos com teto, empate de regra e atividade inválida.
- Critérios de aceite:
  - Suíte cobre principais combinações de regra e edge cases.
- Dependências:
  - PPD-BE-PONT-002.

---

## EPICO 3 - Documentos

### PPD-BE-DOC-001 - Modelar documentos e vínculo com atividades

- Tipo: Task
- Prioridade: P0
- Camada: Backend
- Descrição:
  - Criar entidade `Document` e `ActivityDocument` (ou relação direta).
  - Campos: `fileKey`, `originalName`, `mimeType`, `sizeBytes`, `uploadedBy`, `checksum`, `createdAt`.
- Critérios de aceite:
  - Migration aplicada.
  - Relacionamento com atividade funcional.
- Dependências:
  - PPD-BE-ATV-001.

### PPD-BE-DOC-002 - Implementar upload seguro de arquivos

- Tipo: Story
- Prioridade: P0
- Camada: Backend
- Descrição:
  - Endpoint para upload com validação de tipo/tamanho.
  - Assinatura com storage provider (S3/GCS/local para dev).
  - Estratégia de antivirus/plausibilidade (mínimo: validação de extensão + MIME e limite de tamanho).
- Critérios de aceite:
  - Upload de PDF/JPG/PNG permitido conforme regra.
  - Arquivos fora da política rejeitados com erro explícito.
- Dependências:
  - PPD-BE-DOC-001.

### PPD-BE-DOC-003 - Endpoint de listagem e remoção documental por atividade

- Tipo: Task
- Prioridade: P1
- Camada: Backend
- Descrição:
  - `GET /api/activities/:id/documents`
  - `DELETE /api/documents/:id`
  - Controle de ownership e trilha de auditoria.
- Critérios de aceite:
  - Usuário só manipula documentos próprios.
  - Soft delete ou política de retenção definida.
- Dependências:
  - PPD-BE-DOC-002.

### PPD-FE-DOC-001 - Implementar uploader na feature de atividades

- Tipo: Task
- Prioridade: P0
- Camada: Frontend
- Descrição:
  - Componente de upload com drag-and-drop e barra de progresso.
  - Vínculo de documento à atividade.
- Critérios de aceite:
  - Upload assíncrono com feedback de progresso/sucesso/erro.
  - Lista de anexos por atividade atualizada automaticamente.
- Dependências:
  - PPD-BE-DOC-002.

### PPD-FE-DOC-002 - Tela de central documental e filtros

- Tipo: Story
- Prioridade: P1
- Camada: Frontend
- Descrição:
  - Criar visão de documentos por período/categoria/status de vinculação.
  - Busca textual por nome do arquivo.
- Critérios de aceite:
  - Listagem com paginação e ordenação.
  - Download seguro de arquivo permitido ao owner.
- Dependências:
  - PPD-BE-DOC-003.

### PPD-QA-DOC-001 - Testes de upload e autorização documental

- Tipo: Task
- Prioridade: P1
- Camada: FE+BE
- Descrição:
  - Cobrir validação de tipo/tamanho, permissões e exclusão.
- Critérios de aceite:
  - Casos de sucesso e falha automatizados.
- Dependências:
  - Implementações do épico.

---

## EPICO 4 - Geração de Relatório (RAD)

### PPD-BE-RAD-001 - Modelar estrutura de relatório e submissão

- Tipo: Task
- Prioridade: P0
- Camada: Backend
- Descrição:
  - Criar entidades:
    - `Report`
    - `ReportSection`
    - `ReportSnapshot` (congelamento de evidências no momento de geração)
    - `ReportSubmission`
- Critérios de aceite:
  - Modelagem suporta histórico de versões do relatório.
- Dependências:
  - Épicos 1, 2 e 3 parcialmente concluídos.

### PPD-BE-RAD-002 - Serviço de composição do RAD

- Tipo: Story
- Prioridade: P0
- Camada: Backend
- Descrição:
  - Criar agregador que transforma atividades + documentos + pontuação em estrutura de relatório institucional.
  - Garantir rastreabilidade de cada item para origem (atividade/documento).
- Critérios de aceite:
  - JSON final do relatório possui seções obrigatórias e metadados de conferência.
- Dependências:
  - PPD-BE-RAD-001, PPD-BE-PONT-002.

### PPD-BE-RAD-003 - Exportação PDF do relatório

- Tipo: Story
- Prioridade: P1
- Camada: Backend
- Descrição:
  - Implementar geração de PDF com template institucional.
  - Estratégia recomendada: HTML template + renderizador PDF (playwright/puppeteer).
- Critérios de aceite:
  - Endpoint `GET /api/reports/:id/pdf` retorna arquivo válido.
  - PDF contém paginação, cabeçalho e seções padronizadas.
- Dependências:
  - PPD-BE-RAD-002.

### PPD-FE-RAD-001 - Implementar página real de relatórios

- Tipo: Task
- Prioridade: P0
- Camada: Frontend
- Descrição:
  - Substituir placeholder da rota `/relatorios` por interface funcional.
  - Exibir lista de relatórios, status e ações (preview, gerar, baixar).
- Critérios de aceite:
  - Usuário consegue iniciar geração e acompanhar estado.
- Dependências:
  - PPD-BE-RAD-001.

### PPD-FE-RAD-002 - Implementar preview de relatório

- Tipo: Story
- Prioridade: P1
- Camada: Frontend
- Descrição:
  - Mostrar visualização navegável antes da exportação PDF.
  - Sinalizar seções com pendência de documentação.
- Critérios de aceite:
  - Preview consistente com estrutura final do PDF.
- Dependências:
  - PPD-BE-RAD-002.

### PPD-FE-RAD-003 - Download e histórico de versões

- Tipo: Task
- Prioridade: P1
- Camada: Frontend
- Descrição:
  - Permitir download de versão selecionada e histórico por data.
- Critérios de aceite:
  - Download de PDF funcionando para versões anteriores.
- Dependências:
  - PPD-BE-RAD-003.

### PPD-QA-RAD-001 - Testes de consistência de relatório

- Tipo: Task
- Prioridade: P1
- Camada: FE+BE
- Descrição:
  - Testar cenários com dados incompletos, dados completos e falhas de composição.
- Critérios de aceite:
  - Regressão de template detectável por teste automatizado.
- Dependências:
  - Implementações do épico.

---

## EPICO 5 - Inteligência e Sugestões

### PPD-BE-AI-001 - Criar serviço de sugestão de enquadramento

- Tipo: Story
- Prioridade: P1
- Camada: Backend
- Descrição:
  - Implementar camada de recomendação baseada em regras para classificar atividades ambíguas.
  - Input: atividade livre.
  - Output: categoria sugerida + confiança + justificativa.
- Critérios de aceite:
  - Recomendação determinística para regras conhecidas.
  - Resposta inclui explicabilidade mínima.
- Dependências:
  - PPD-BE-PONT-001, PPD-BE-ATV-002.

### PPD-BE-AI-002 - Detector de inconsistência de cadastro vs barema

- Tipo: Task
- Prioridade: P1
- Camada: Backend
- Descrição:
  - Validar inconsistências em atividades (categoria incompatível, teto estourado, documento ausente).
  - Expor endpoint de validação pré-submissão.
- Critérios de aceite:
  - Retorno com lista de inconsistências categorizadas por severidade.
- Dependências:
  - PPD-BE-AI-001, PPD-BE-DOC-003.

### PPD-FE-AI-001 - Exibir recomendações de classificação na UI de atividade

- Tipo: Task
- Prioridade: P1
- Camada: Frontend
- Descrição:
  - Na criação/edição de atividade, oferecer sugestões automáticas de categoria.
- Critérios de aceite:
  - Usuário pode aceitar/rejeitar sugestão.
  - Feedback é salvo para melhoria futura do mecanismo.
- Dependências:
  - PPD-BE-AI-001.

### PPD-FE-AI-002 - Painel de inconsistências e correções guiadas

- Tipo: Story
- Prioridade: P1
- Camada: Frontend
- Descrição:
  - Criar visão de pendências com CTA para correção direta.
- Critérios de aceite:
  - Pendências navegáveis até origem (atividade/documento).
- Dependências:
  - PPD-BE-AI-002.

### PPD-BE-AI-003 - Otimizador de pontuação (planejamento orientado)

- Tipo: Story
- Prioridade: P2
- Camada: Backend
- Descrição:
  - Dado o perfil atual, sugerir atividades de maior impacto para próxima progressão.
- Critérios de aceite:
  - Endpoint retorna top recomendações com ganho estimado por pilar.
- Dependências:
  - PPD-BE-PONT-002.

### PPD-FE-AI-003 - UI de otimização com cenários recomendados

- Tipo: Task
- Prioridade: P2
- Camada: Frontend
- Descrição:
  - Exibir recomendações priorizadas com comparativo de impacto.
- Critérios de aceite:
  - Usuário visualiza ganho estimado e pré-requisitos de cada recomendação.
- Dependências:
  - PPD-BE-AI-003.

---

## TRANSVERSAIS (Governança, qualidade, observabilidade, segurança)

### PPD-BE-PLAT-001 - Completar integração de recuperação de senha por e-mail

- Tipo: Task
- Prioridade: P1
- Camada: Backend
- Descrição:
  - Integrar provider de e-mail transacional para forgot/reset password.
  - Criar template de e-mail com token e validade.
- Critérios de aceite:
  - Fluxo end-to-end de recuperação testado.
- Dependências:
  - Nenhuma.

### PPD-FE-PLAT-001 - Finalizar UX de recuperação de senha com confirmação clara

- Tipo: Task
- Prioridade: P1
- Camada: Frontend
- Descrição:
  - Melhorar feedback de envio, estado de loading e mensagens de erro por contexto.
- Critérios de aceite:
  - Usuário entende se o passo foi concluído sem vazamento de informação sensível.
- Dependências:
  - PPD-BE-PLAT-001.

### PPD-BE-PLAT-002 - Observabilidade e rastreio de erros

- Tipo: Story
- Prioridade: P1
- Camada: Backend
- Descrição:
  - Implantar logs estruturados + integração com plataforma de erro (Sentry/OpenTelemetry).
- Critérios de aceite:
  - Erros críticos geram eventos rastreáveis com correlation id.
- Dependências:
  - Nenhuma.

### PPD-FE-PLAT-002 - Observabilidade frontend

- Tipo: Story
- Prioridade: P2
- Camada: Frontend
- Descrição:
  - Instrumentar captura de erro de runtime e falhas de rede relevantes.
- Critérios de aceite:
  - Falhas críticas aparecem no painel de observabilidade.
- Dependências:
  - PPD-BE-PLAT-002.

### PPD-QA-PLAT-001 - Meta de qualidade de testes (>=80% por módulo novo)

- Tipo: Task
- Prioridade: P1
- Camada: FE+BE
- Descrição:
  - Definir e aplicar policy de cobertura para novos módulos dos épicos.
- Critérios de aceite:
  - Pipeline falha se cobertura mínima dos novos módulos não for atendida.
- Dependências:
  - Nenhuma.

### PPD-ARQ-001 - Definir contratos API versionados para domínios novos

- Tipo: Task
- Prioridade: P2
- Camada: Arquitetura
- Descrição:
  - Padronizar versionamento e documentação de contratos REST para atividades, documentos, scoring e relatórios.
- Critérios de aceite:
  - Contratos publicados e usados por FE/BE.
- Dependências:
  - Nenhuma.

## 7. Sugestão de sequenciamento (macroplanejamento)

## Fase 1 - Fundamentos de domínio (P0)

1. Modelagem Prisma de atividades e documentos.
2. CRUD de atividades backend + frontend.
3. Engine de pontuação mínima e dashboard real.

## Fase 2 - Entrega de valor operacional

1. Upload documental e checklist mínimo.
2. Composição de relatório RAD.
3. Geração e download PDF.

## Fase 3 - Diferenciais competitivos

1. Recomendação de classificação.
2. Detector de inconsistências.
3. Otimizador de pontuação.

## 8. Riscos de execução mapeados

1. Risco de retrabalho alto se o barema não for modelado corretamente desde o início.
2. Risco de acoplamento excessivo FE/BE sem contratos claros por domínio.
3. Risco de baixa confiança do usuário se dashboard continuar com score hardcoded.
4. Risco de gargalo operacional se gestão documental não vier junto do CRUD de atividades.

## 9. Conclusão analítica

O projeto já possui uma base de engenharia consistente para autenticação, segurança, estrutura de rotas e experiência inicial de dashboard.

Porém, o núcleo de negócio do épico da Plataforma Progressão ainda está majoritariamente em aberto.

A recomendação é priorizar, imediatamente, as tasks P0 de modelagem de domínio e CRUD de atividades junto com cálculo de pontuação real, pois esses itens destravam todos os demais épicos (documentos, RAD e inteligência).

Sem essa base, qualquer avanço visual no frontend tende a gerar dívida técnica e baixa aderência ao problema real que o produto se propõe a resolver.
