# AGENTS.md — Common Codex Instructions (all tasks)

> Monorepo: **powercoach** · Outils: **pnpm**, **Turborepo**, **TypeScript**, **ESLint/Prettier**, **Vitest** · Apps: `apps/api` (Fastify), `apps/manager` (React + Vite) · Packages partagés: `packages/*`

This document defines the rules and routines **that every Codex agent applies by default**, regardless of the task (bug, feature, refactor, CI/CD, docs). It prevents repeating these guidelines in every task prompt.

---

## 1) Objective and Expected Outcome

- **Livrable minimal** : code compilable, typé, linté, formaté, **tests à jour**, et **pipeline CI vert** pour le scope modifié.
- **Zéro régression** : ne pas casser les autres apps/packages du monorepo.
- **DX** : garder la cohérence avec les conventions du repo.

---

## 2) Repository Context (Key Facts)

- **Gestionnaire** : pnpm (workspace, lockfile unique).
- **Orchestration** : Turborepo (`turbo.json`) avec tâches standard :
  - `build`, `dev` (persistant), `format` / `format:write`, `lint` / `lint:fix`,
  - `test` / `test:watch`, `typecheck` (et variantes `:src`, `:test`).
- **Node.js** : v**20** (GitHub Actions utilise 20).
- **Langage** : TypeScript strict sur src + tests.
- **Qualité** :
  - ESLint configs partagées via `@powercoach/config`.
  - Prettier via `@powercoach/config` (garde **singleQuote**, **no semi**, **printWidth 100**, **trailingComma: none**).
  - Tests via **Vitest** (+ coverage).
- **Apps** :
  - `apps/api` : Fastify 5, modules/routeurs typés (TypeBox), log **pino**.
  - `apps/manager` : React 19 + Vite ; script `vercel:prepare` disponible pour le déploiement.
- **CI** :
  - Workflows séparés **par app** (CI sur push/PR ciblant `main` et filtrés par dossier).
  - CD déclenché sur **workflow_run: completed** de la CI correspondante (condition `success`).

> Implication : **filtrer** vos commandes Turborepo avec `--filter=@powercoach/<app|pkg>` quand pertinent ; ne modifiez pas ce qui n’est pas dans le scope de la tâche.

---

## 3) Generic Roles of Agents

- **Planner** : clarifie la demande en plan d’action concret (impacts, fichiers, migrations), évalue risques/alternatives.
- **Implementer** : code l’implémentation **la plus simple qui marche**, typée, testée.
- **Reviewer/Fixer** : exécute et corrige `format`, `lint`, `typecheck`, `test` ; stabilise CI ; réduit la diff.
- **Documenter** : met à jour README/CHANGELOG/docs des modules impactés si besoin (usage, env, limites).

> Un seul agent peut enchaîner ces rôles, mais **dans cet ordre**.

---

## 4) Expected Inputs for Any Task

Avant de commencer, l’agent extrait (ou infère) :

- **Scope** : {app(s)/package(s) impactés, fichiers clés, APIs, routes, UI}.
- **Critères d’acceptation** (tests implicites/explicites).
- **Compatibilité** : API publique/contrats existants à préserver.
- **Observabilité** : logs/erreurs attendues.
- **CI/CD** : jobs concernés et artefacts attendus.

S’il manque une info **bloquante**, proposer l’hypothèse **la plus sûre** et continuer.

---

## 5) Execution Checklists (Always)

### 5.1 Plan

- [ ] Lister changements par fichier/dossier (création/suppression/modif).
- [ ] Identifier nouveaux types/schemas/validations.
- [ ] Définir la stratégie de test (unit/integration/UI).

### 5.2 Implémentation

- [ ] **TypeScript d’abord** : types explicites, pas d’`any` non justifié.
- [ ] Respecter les configs partagées `@powercoach/config` (ESLint/Prettier/TS/Vitest).
- [ ] **Pas de code mort** / TODO non traités dans la diff.
- [ ] Logs: sobres, niveau adapté, **pas de secrets**.

### 5.3 Qualité + CI locale

- [ ] `pnpm format:write`
- [ ] `pnpm lint`
- [ ] `pnpm typecheck`
- [ ] `pnpm test` (ou ciblé `pnpm -F @powercoach/<cible> test`)
- [ ] `pnpm -w build` si le build est concerné

### 5.4 PR & Docs

- [ ] PR **petite et ciblée**, titre conventionnel (voir §7).
- [ ] Description : **problème → solution → impacts → tests → risques**.
- [ ] Screenshots/Logs utiles si UI/observabilité.
- [ ] Docs mises à jour si comportement/usage change.

---

## 6) Code & Structure Conventions

- **Imports** : ordre stable, pas de doublons (`eslint-plugin-import`).
- **Erreurs** : messages clairs ; côté API, utiliser réponses Fastify typées + schémas.
- **Config/Secrets** : via env, **jamais** commités.
- **Performance** : préférer la clarté ; n’optimiser qu’en cas d’évidence mesurable.
- **Tests** :
  - Nommer par comportement, pas par méthode.
  - Couvrir happy path + erreurs courantes.
  - Pas de dépendance réseau réelle en unit tests.
- **Front (manager)** : composants purs, hooks dédiés, éviter la logique couplée au rendu.
- **Back (api)** : routes isolées par module (`apps/api/src/modules/**`), schémas d’E/S centralisés.

---

## 7) Git, Branches, Commits, PR

- **Branches** : `type/scope/short-desc` (ex: `feat/api/add-user`).
- **Commits** : Conventional Commits (via commitlint) — ex. `feat(api): add POST /users`.
- **PR title** : même règle que le commit scope principal.
- **PR body** (template) :

```
## Contexte
<problème utilisateur / technique>

## Solution
<approche, alternatives, limites>

## Impacts
<API, UI, perf, DX, migrations>

## Tests
<type de tests + couverture>

## Notes CI/CD
<jobs affectés, flags, filtres turbo>
```

---

## 8) Useful Commands (Monorepo)

- Workspace entier :  
  `pnpm -w format:write | lint | typecheck | test | build`
- Ciblage (ex. API) :  
  `pnpm -F @powercoach/api <script>`  
  ou Turborepo : `pnpm turbo run <task> --filter=@powercoach/api`
- Dev:
  - API : `pnpm -F @powercoach/api dev`
  - Manager : `pnpm -F @powercoach/manager dev`

---

## 9) CI/CD: Minimum Expectations

- **CI (par app)** doit passer : Lint, Format (check), Typecheck, Test, Build.
- **CD** ne s’exécute que si la CI correspondante est **success**.
- L’agent ajuste les filtres Turbo/env nécessaires mais **ne modifie pas** la structure des workflows sauf demande explicite.

---

## 10) Security, Confidentiality, Compliance

- Pas de secrets ni tokens en clair (code, logs, PR, artefacts).
- Respecter **.prettierignore** / **.gitignore** ; ne pas commit `dist/`, `.turbo/`, etc.
- Dépendances : **pas** d’ajout sans justification (taille, maintenance, sécurité).

---

## 11) Generic Definition of Done

- [ ] Fonctionnalité/bugfix conforme aux critères d’acceptation.
- [ ] Lint/format/typecheck/tests OK localement et en CI.
- [ ] Pas de breaking change involontaire sur d’autres apps/packages.
- [ ] Docs/PR conformes et utiles.
- [ ] Diff lisible et limitée au scope.

---

## 12) Annexes (Tooling Reminders)

- **Prettier (config partagée)** : singleQuote, no-semi, width=100, trailingComma=none.
- **ESLint** : règles import/order, no duplicates, TS strict, globals adaptés web/node.
- **Vitest** : `run --coverage --reporter=verbose` pour CI ; `vitest` en watch local.
- **TypeScript** : séparer tsconfig **src** et **test** ; ne rien émettre (`--noEmit`) sur typecheck.
- **Turborepo** : ne publie que `dist/**` ; `dev` est persistant, **sans cache**.

---

## 13) When the Task Affects Multiple Scopes

- Scinder en sous-tâches par app/package.
- Valider chaque sous-tâche indépendamment (tests, CI locale).
- Ouvrir 1 PR par scope si possible (réduit les risques CD).

---

_End — this file is the single source of common rules. Codex tasks may reference “AGENTS.md” without repeating these guidelines._
