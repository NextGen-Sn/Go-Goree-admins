# Plan de refactorisation — Phase 1 (cartographie)

Résumé : inventaire statique extrait de `src/app/App.tsx`. Ne rien modifier encore — ce fichier contient la liste complète des pages, composants partagés et jeux de données factices à isoler.

## 1) Pages (IDs extraits de `NAV`)

- dashboard
- voyages-liste
- voyages-creer
- voyages-modifier
- voyages-planning
- voyages-historique
- billets-liste
- billets-export
- passagers-profil
- ctrl-liste
- ctrl-planning
- chaloupes-liste
- chaloupes-maintenance
- chaloupes-planning
- tarifs-grille
- tarifs-categories
- tarifs-horaires
- paie-transactions
- paie-wave
- paie-orange
- paie-yas
- paie-carte
- wallet-solde
- wallet-mouvements
- wallet-rechargements
- wallet-debits
- res-liste
- res-refusees
- res-historique
- notifs-envoyer
- notifs-sms
- notifs-email
- notifs-push
- notifs-inapp
- notifs-historique
- stats-overview
- stats-billets
- stats-recettes
- stats-occupation
- stats-heures
- stats-categories
- stats-validation
- stats-paiements
- rapp-generer
- rapp-pdf
- rapp-excel
- rapp-csv
- rapp-historique
- params-general
- params-securite
- params-roles
- params-agents
- params-api
- params-journal
- params-sauvegardes
- support-faq
- support-tickets

Remarque : certains sous-IDs sont construits dynamiquement (ex: `voyages-*`, `billets-*`, `ctrl-*`, etc.). Le router devra reproduire ces mappings.

## 2) Composants / utilitaires partagés (à extraire dans `src/app/components/layout` et `src/app/components/ui` si pertinent)

- `Sidebar` (menu latéral, logique d'expansion/collapse et affichage des items NAV)
- `TopBar` / `Topbar` (header, recherche, mode sombre)
- `Badge`, `StatusBadge` (petits composants d'affichage d'état)
- `KPICard`, `ChartCard`, `PageHeader`, `Btn`, `Table`, `SearchBar`, `Card`, `OccBar`
- `ImageWithFallback` (déjà dans `components/figma` — ne pas toucher)
- util `cn(...)` (concaténation de classes)

Ces composants sont réutilisés par quasiment toutes les pages et doivent être extraits tels quels pour préserver le rendu.

## 3) Système de navigation actuel

- Navigation implémentée par un état local `currentPage` dans `App` et par la fonction `renderPage(page)`.
- `Sidebar` déclenche `onNav(page)` qui met à jour `currentPage`.
- Mode sombre géré via `darkMode` + `document.documentElement.classList.toggle("dark", darkMode)`.
- Notifications : il y a une UI (icône `Bell`, badges) mais **aucune dépendance externe `sonner`** détectée — la notif. est visuelle uniquement pour l'instant.

## 4) Jeux de données mockées (globaux définis en tête de fichier)

- `monthlyData` — utilisé par : Dashboard (recettes mensuelles), Stats, Paiements, Rapports
- `dailyHistorique` — utilisé par : Dashboard (historique), Voyages historique
- `ticketData` — Dashboard (bar chart)
- `pieData` — Dashboard / Stats / Rapports (répartition passagers)
- `paiementData` — Paiements / Stats (répartition moyens de paiement)
- `hourlyData` — Stats (heures de pointe)
- `voyages` — Dashboard (table Voyages du jour), Voyages liste
- `passagers` — PassagersPage, Wallet top wallets
- `transactions` — Dashboard dernières transactions, Paiements transactions
- `demandesResidents` — Residents pages (liste, examen, historique)
- `controleurs` — CtrlPage (liste + planning)
- `chaloupesData` — Chaloupes pages (flotte, maintenance, planning)

## 5) Jeux de données mockées locales (définies à l'intérieur de composants)

- `billets` (défini localement dans `BilletsPage`)
- `cats` (catégories tarifaires, défini dans `TarifsPage`)
- `mouvements` (défini dans `WalletPage`)
- `cats` / `labels` / petites tables d'options présents dans plusieurs pages (rapports, notifications, exports)

Ces petites tables locales devront être centralisées dans `src/app/data/mock/` (un fichier par domaine) lors de la Phase 4.

## 6) Points d'attention / notes

- Conserver strictement les mêmes classes Tailwind et noms de variables pour éviter toute régression visuelle.
- Certaines données sont calculées inline (ex: occupation via Math.round((v.vendus / v.places) * 100)). Garder la logique telle quelle.
- `renderPage` utilise des conventions de préfixe (`voyages-`, `billets-`, `ctrl-`, `chaloupes-`, `tarifs-`, `paie-`, `wallet-`, `res-`, `notifs-`, `stats-`, `rapp-`, `params-`, `support-`) — utile pour dériver les routes.
- Login flow: `isLoggedIn` garde l'accès au dashboard. Lors du passage à `react-router-dom` il faudra préserver cette logique (protéger les routes via un simple wrapper ou route privée).

---

Étapes suivantes :
- Phase 2 (découpage) — ✅ TERMINÉE (voir résumé ci-dessous)

---

## Phase 2 — Résumé d'exécution (13 Juillet 2026)

### ✅ Tâches accomplies

#### 1. Centralisation des mocks locaux → `dashboard.mock.ts`
| Export ajouté | Origine |
|---|---|
| `billets` | `BilletsPage.tsx` (array inline) |
| `mouvements` | `WalletPage.tsx` (array inline) |
| `tarifsCategories` | `TarifsPage.tsx` (array inline `cats`) |

#### 2. Mise à jour des pages consommatrices
- **`BilletsPage.tsx`** — suppression array local, import depuis mock
- **`WalletPage.tsx`** — suppression array local, import depuis mock
- **`TarifsPage.tsx`** — suppression array local, import depuis mock + fix icônes `Plus` et `Clock` manquantes dans les imports Lucide

#### 3. Création des composants manquants (cause du crash post-login)
- **`Sidebar.tsx`** → `src/app/components/layout/Sidebar.tsx`
  - Navigation complète depuis `NAV`, icônes mappées par id, expand/collapse par section
  - Mode réduit (icon-only, w=64px) avec AnimatePresence
  - Badges de notifications sur les sections parentes
  - Bouton logout
- **`TopBar.tsx`** → `src/app/components/layout/TopBar.tsx`
  - Titre de page résolu dynamiquement depuis `NAV`
  - Barre de recherche, toggle dark mode, badge notification, avatar admin

#### 4. Nettoyage de `App.tsx`
- Supprimé : 30+ imports Lucide inutilisés (héritage pages inline)
- Supprimé : imports recharts (`AreaChart`, `Bar`, `PieChart`, etc.) inutilisés
- Supprimé : import des 12 datasets mock (non utilisés dans App.tsx)
- Ajouté : `import Sidebar from "@/app/components/layout/Sidebar"`
- Ajouté : `import TopBar from "@/app/components/layout/TopBar"`
- Migré : palette `C` locale → `import { C } from "@/app/components/layout/common"`
- Taille : 194 lignes → 117 lignes (−40%)

#### 5. Correction `main.tsx`
- Ajouté `import React from "react"` manquant

### ✅ Vérification build
- `npm run build` → succès, zéro erreur TypeScript/bundler
- `npm run dev` → login fonctionne, sidebar et topbar s'affichent, navigation opérationnelle

### Notes pour Phase 3 (optionnelle)
- Migrer le routage custom (`renderPage` + préfixes) vers `react-router-dom` v7 (déjà installé)
- Ajouter des tests unitaires pour les composants partagés
- Découper les pages volumineuses (ParamsPage 17 ko, StatsPage 13 ko, ChaloupesPage 12 ko)

---

## Correctifs de régression (13 Juillet 2026 — post Phase 2)

Deux régressions visuelles introduites par l'extraction Sidebar/TopBar corrigées :

### 1. Dark mode sur la Sidebar
- **Cause** : `Sidebar.tsx` utilisait un fond blanc en dur (`style={{ background: C.sidebarBg }}` = `#FFFFFF`) et des bordures `#C2D3EE` inline, qui ne réagissaient pas au `.dark` toggle sur `<html>`.
- **Mécanisme confirmé** : dark mode = classe `.dark` sur `<html>` (`App.tsx` via `document.documentElement.classList.toggle`), activé en Tailwind v4 par `@custom-variant dark (&:is(.dark *))` dans `src/styles/theme.css:1`. Tous les `dark:` réagissent à ce toggle.
- **Fix** : remplacé les `style` inline par les mêmes classes que `TopBar` (`bg-white dark:bg-slate-900`, `border-slate-200 dark:border-slate-800`, `text-slate-600 dark:text-slate-300`, etc.) + variantes hover. `C.sidebarBg`/`C.sidebarBorder` supprimés de `Sidebar.tsx` (le gradient `C.sidebarActive` reste pour les états actifs).

### 2. Panneau gauche de la page Login
- **Récupéré ou recréé ?** → **RECÉRÉ**. Aucun `.git` présent (pas de dépôt), et le markup du panneau gauche (« Gérez la liaison Dakar ↔ Gorée en toute simplicité », stats) n'existe dans aucun fichier du repo. Impossible à retrouver dans l'historique.
- **Reconstitution** : `LoginPage` (`App.tsx`) passé en layout 2 colonnes. Panneau gauche (`hidden md:flex`, fond `C.sidebarActive` = dégradé ocean→teal) avec logo, titre, texte descriptif et 3 stats ; panneau droit = formulaire existant (inputs dotés de `dark:` pour suivre le thème).
- **Données des 3 stats** : dérivées des valeurs de juillet dans `dashboard.mock.ts` (`monthlyData[6]`) → 12 280 billets, 94 % occupation, 61,4 M FCFA recettes. Cohérentes avec les données de l'app, mais le libellé/agencement est une recréation.

### Vérification
- `npm run build` → succès (2643 modules, 0 erreur).
- `npm run dev` → modules transformés (200) ; `Sidebar.tsx` contient 23 utilitaires `dark:`, `App.tsx` contient le panneau gauche.

---

## Phase 3 — Migration react-router-dom v7 (Mission 1.5, 13 Juillet 2026)

Le routage custom (`useState("dashboard")` + `renderPage()` par switch d'état, sans
changement d'URL) est remplacé par un vrai routing `react-router-dom` v7.

> **Note technique** : `package.json` liste `react-router` (v7.13.0), **pas**
> `react-router-dom`. En v7, les bindings DOM (`BrowserRouter`, `Routes`, `Route`,
> `NavLink`, `Outlet`, `useLocation`, `Navigate`) sont exportés directement depuis
> `react-router`. Tous les imports pointent donc vers `react-router` (et non
> `react-router-dom`, absent du `node_modules`).

### 1. Setup routeur (Phase 2)
- `src/main.tsx` : `<App />` enveloppé dans `<BrowserRouter>`.
- `src/app/auth.tsx` (nouveau) : `AuthContext` + `useAuth()` (état login/logout
  déplacé de `App`, partagé sans prop drilling).
- `src/app/lib/routes.ts` (nouveau) : `PAGE_TO_PATH` (ID NAV → URL), `pathForPage()`
  et `titleForPath()` (titre TopBar dérivé de l'URL).
- `src/app/layouts/AdminLayout.tsx` (nouveau) : Sidebar + TopBar + `<Outlet />` ;
  animation de fondu sur changement de route (`motion.div key={location.pathname}`).
- `src/app/routes/AppRoutes.tsx` (nouveau) : `<Routes>` centralisées, route `/login`
  publique, layout admin protégé par `RequireAuth` (redirige vers `/login` si
  non connecté), catch-all `*` → `/`.
- `src/app/App.tsx` : **minimal** — plus de `renderPage()`, plus de `useState`
  de page ; ne rend que `<AppRoutes />` (fournit auth + darkMode).
- `src/app/layouts/LoginPage.tsx` (nouveau) : `LoginPage` extraite d'`App.tsx`,
  utilise `useAuth().login`.

### 2. Sidebar adaptée (Phase 3)
- Plus de props `current` / `onNav` / `navigate` / `expanded` / `onToggle` /
  `collapsed` / `onCollapse` / `onLogout`.
- Liens en `<NavLink to={pathForPage(child.page)} end>` ; style actif via
  `className={({isActive}) => ...}` et `style={({isActive}) => ...}`.
- Section parente active dérivée de `useLocation().pathname` ; expansion auto de
  la section contenant la route active ; état d'expand/collapse géré en interne
  (`useState`). Logout via `useAuth().logout`.

### 3. TopBar adaptée (Phase 3)
- Plus de prop `page` ; titre de page résolu via `useLocation()` +
  `titleForPath(pathname)` (ex : `/voyages/creer` → « Voyages — Créer un voyage »).

### 4. Sous-vues internes (Phase 4)
- Aucune page n'a été restructurée : chaque page garde sa prop `sub` et son
  rendu identique. Chaque sous-vue NAV = **une route dédiée** qui passe le `sub`
  littéral (ex : `<Route path="/voyages/creer" element={<VoyagesPage sub="creer" />} />`).
  Pas de route imbriquée avec `<Outlet/>` dans les pages → **zéro régression visuelle**.

### 5. Mapping & vérification
- Mapping complet (49 routes) : `ROUTES_MAPPING.md`. Index de section = premier
  enfant NAV ; segments en français sans accent.
- **À clarifier (pas de routes créées)** : `SupportPage` (faq/tickets, absent de
  `NAV`), subs `ParamsPage` `roles/agents/api/journal/sauvegardes/tarifs`,
  `BilletsPage` `export`, `WalletPage` `exports` — code existant mais non navigable.
- `npm run build` → succès (2656 modules, 0 erreur).
- `npm run dev` → tous les modules routeur transformés (200), fallback SPA
  (`GET /voyages` → `index.html`) confirmé → F5 sur URL profonde fonctionne.

### Commits
Séparés par étape : setup routeur / adaptation Sidebar / adaptation TopBar / docs.

