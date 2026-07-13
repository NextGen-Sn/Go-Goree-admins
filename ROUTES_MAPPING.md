# Mapping des routes — Migration react-router-dom (Mission 1.5)

Mapping **ancien ID de page** (état React `renderPage()`) → **nouvelle URL**
vraie (`react-router-dom`). Source unique des IDs : `src/app/lib/navigation.ts`.

## Règle de conversion appliquée

- Le préfixe avant le premier `-` donne le segment de section :
  `voyages` → `/voyages`, `paie` → `/paiements`, `res` → `/residents`,
  `notifs` → `/notifications`, `stats` → `/statistiques`, `rapp` → `/rapports`,
  `params` → `/parametres`, etc.
- Le **premier enfant** d'une section (celui dont le suffixe est `liste` quand il
  existe) devient la route **index** de la section (`/section`).
- Les autres enfants deviennent `/section/<suffixe>`.
- `dashboard` → `/` (racine).
- La colonne `sub` = valeur passée à la prop `sub` du composant de page
  (le rendu existant ne change pas : on conserve la prop `sub` telle quelle,
  on ne crée **pas** de route imbriquée avec `<Outlet/>` dans la page).

## Table de mapping (49 routes feuilles)

| Ancien ID (`page`)        | Nouvelle URL              | Composant cible     | `sub`          |
|---------------------------|---------------------------|---------------------|----------------|
| `dashboard`               | `/`                       | `DashboardPage`     | — (aucun)      |
| `voyages-liste`           | `/voyages`                | `VoyagesPage`       | `liste`        |
| `voyages-creer`           | `/voyages/creer`          | `VoyagesPage`       | `creer`        |
| `voyages-modifier`        | `/voyages/modifier`       | `VoyagesPage`       | `modifier`     |
| `voyages-planning`        | `/voyages/planning`       | `VoyagesPage`       | `planning`     |
| `voyages-historique`      | `/voyages/historique`     | `VoyagesPage`       | `historique`   |
| `billets-liste`           | `/billets`                | `BilletsPage`       | `liste`        |
| `passagers-profil`        | `/passagers`              | `PassagersPage`     | `profil`       |
| `ctrl-liste`              | `/controleurs`            | `CtrlPage`          | `liste`        |
| `ctrl-planning`           | `/controleurs/planning`   | `CtrlPage`          | `planning`     |
| `chaloupes-liste`         | `/chaloupes`              | `ChaloupesPage`     | `liste`        |
| `chaloupes-maintenance`   | `/chaloupes/maintenance`  | `ChaloupesPage`     | `maintenance`  |
| `chaloupes-planning`      | `/chaloupes/planning`     | `ChaloupesPage`     | `planning`     |
| `tarifs-grille`           | `/tarifs`                 | `TarifsPage`        | `grille`       |
| `tarifs-categories`       | `/tarifs/categories`      | `TarifsPage`        | `categories`   |
| `tarifs-horaires`         | `/tarifs/horaires`        | `TarifsPage`        | `horaires`     |
| `paie-transactions`       | `/paiements`              | `PaiementsPage`     | `transactions` |
| `paie-wave`               | `/paiements/wave`         | `PaiementsPage`     | `wave`         |
| `paie-orange`             | `/paiements/orange`       | `PaiementsPage`     | `orange`       |
| `paie-yas`                | `/paiements/yas`          | `PaiementsPage`     | `yas`          |
| `paie-carte`              | `/paiements/carte`        | `PaiementsPage`     | `carte`        |
| `wallet-solde`            | `/wallet`                 | `WalletPage`        | `solde`        |
| `wallet-mouvements`       | `/wallet/mouvements`      | `WalletPage`        | `mouvements`   |
| `wallet-rechargements`    | `/wallet/rechargements`   | `WalletPage`        | `rechargements`|
| `wallet-debits`           | `/wallet/debits`          | `WalletPage`        | `debits`       |
| `res-liste`               | `/residents`              | `ResidentsPage`     | `liste`        |
| `res-refusees`            | `/residents/refusees`     | `ResidentsPage`     | `refusees`     |
| `res-historique`          | `/residents/historique`   | `ResidentsPage`     | `historique`   |
| `notifs-envoyer`          | `/notifications`          | `NotifsPage`        | `envoyer`      |
| `notifs-sms`              | `/notifications/sms`      | `NotifsPage`        | `sms`          |
| `notifs-email`            | `/notifications/email`    | `NotifsPage`        | `email`        |
| `notifs-push`             | `/notifications/push`     | `NotifsPage`        | `push`         |
| `notifs-inapp`            | `/notifications/inapp`    | `NotifsPage`        | `inapp`        |
| `notifs-historique`       | `/notifications/historique`| `NotifsPage`       | `historique`   |
| `stats-overview`          | `/statistiques`           | `StatsPage`         | `overview`     |
| `stats-billets`           | `/statistiques/billets`   | `StatsPage`         | `billets`      |
| `stats-recettes`          | `/statistiques/recettes`  | `StatsPage`         | `recettes`     |
| `stats-occupation`        | `/statistiques/occupation`| `StatsPage`         | `occupation`   |
| `stats-heures`            | `/statistiques/heures`    | `StatsPage`         | `heures`       |
| `stats-categories`        | `/statistiques/categories`| `StatsPage`         | `categories`   |
| `stats-validation`        | `/statistiques/validation`| `StatsPage`         | `validation`   |
| `stats-paiements`         | `/statistiques/paiements` | `StatsPage`         | `paiements`    |
| `rapp-generer`            | `/rapports`               | `RapportsPage`      | `generer`      |
| `rapp-pdf`                | `/rapports/pdf`           | `RapportsPage`      | `pdf`          |
| `rapp-excel`              | `/rapports/excel`         | `RapportsPage`      | `excel`        |
| `rapp-csv`                | `/rapports/csv`           | `RapportsPage`      | `csv`          |
| `rapp-historique`         | `/rapports/historique`    | `RapportsPage`      | `historique`   |
| `params-general`          | `/parametres`             | `ParamsPage`        | `general`      |
| `params-securite`         | `/parametres/securite`    | `ParamsPage`        | `securite`     |

**Total : 49 routes feuilles** mappées depuis `navigation.ts`.

## À clarifier (code existant sans entrée `navigation.ts`)

Ces branches existent dans les composants de page mais **n'ont aucune entrée dans
`navigation.ts`** → elles n'étaient déjà pas accessibles depuis le menu avant la
migration. Conformément à la consigne « ne pas inventer de route », **Phase 2 ne
crée PAS de route pour elles**. À décider séparément (ajouter une entrée NAV +
route, ou laisser tel quel) :

1. **`SupportPage`** (`src/app/pages/SupportPage.tsx`) — composant réel avec
   sous-vues `faq` / `tickets`, mais **aucune section `support` dans `navigation.ts`**
   → page totalement inaccessible depuis le menu. (IDs cités dans l'inventaire
   REFACTOR_PLAN : `support-faq`, `support-tickets`.)
2. **`ParamsPage`** — branches de code pour `sub` = `roles`, `agents`, `api`,
   `journal`, `sauvegardes`, `tarifs` présentes dans le composant, mais absentes
   de `navigation.ts` (qui ne contient que `general` + `securite`).
3. **`BilletsPage`** — branche `sub === "export"` (vue « Export & Impression »),
   absente de `navigation.ts` (REFACTOR_PLAN cite `billets-export`).
4. **`WalletPage`** — branche `sub === "exports"` (vue « Export wallet »),
   absente de `navigation.ts`.

**Décision proposée pour Phase 2** : créer les routes **uniquement** pour les 49
IDs listés ci-dessus. Les 4 points « À clarifier » restent hors route jusqu'à
décision explicite (ils n'étaient déjà pas navigables).
