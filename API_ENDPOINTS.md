# API Endpoints — Dashboard GO GORÉE

Endpoints consommés par les services de `src/app/services/`. Routes REST
devinées à partir des besoins du front ; toutes les URL sont relatives à la
`baseURL` du client concerné (`VITE_API_LARAVEL_URL` pour Laravel,
`VITE_API_GO_URL` pour le service Go temps réel).

| Domaine | Méthode | Route | Service | Statut |
|---|---|---|---|---|
| Voyages | GET | `/voyages` | voyagesService.listVoyages | à confirmer avec l'équipe backend |
| Voyages | GET | `/voyages/du-jour` | voyagesService.getVoyagesDuJour | à confirmer avec l'équipe backend |
| Voyages | GET | `/voyages/historique` | voyagesService.getVoyagesHistorique | à confirmer avec l'équipe backend |
| Voyages | GET | `/voyages/:id` | voyagesService.getVoyage | à confirmer avec l'équipe backend |
| Voyages | POST | `/voyages` | voyagesService.createVoyage | à confirmer avec l'équipe backend |
| Voyages | PUT | `/voyages/:id` | voyagesService.updateVoyage | à confirmer avec l'équipe backend |
| Voyages | DELETE | `/voyages/:id` | voyagesService.deleteVoyage | à confirmer avec l'équipe backend |
| Billets | GET | `/billets` | billetsService.listBillets | à confirmer avec l'équipe backend |
| Billets | GET | `/billets/:id` | billetsService.getBillet | à confirmer avec l'équipe backend |
| Billets | POST | `/billets` | billetsService.createBillet | à confirmer avec l'équipe backend |
| Billets | GET | `/billets/:id/imprimer` | billetsService.imprimerBillet | à confirmer avec l'équipe backend |
| Billets | GET | `/billets/export/:format` | billetsService.exportBillets | à confirmer avec l'équipe backend |
| Passagers | GET | `/passagers` | passagersService.listPassagers | à confirmer avec l'équipe backend |
| Passagers | GET | `/passagers/:id` | passagersService.getPassager | à confirmer avec l'équipe backend |
| Contrôleurs (Go) | GET | `/controleurs` | controleursService.listControleurs | à confirmer avec l'équipe backend |
| Contrôleurs (Go) | GET | `/controleurs/:id` | controleursService.getControleur | à confirmer avec l'équipe backend |
| Contrôleurs (Go) | GET | `/controleurs/planning` | controleursService.getPlanningControleurs | à confirmer avec l'équipe backend |
| Chaloupes | GET | `/chaloupes` | chaloupesService.listChaloupes | à confirmer avec l'équipe backend |
| Chaloupes | GET | `/chaloupes/:id` | chaloupesService.getChaloupe | à confirmer avec l'équipe backend |
| Chaloupes | PATCH | `/chaloupes/:id/statut` | chaloupesService.updateStatutChaloupe | à confirmer avec l'équipe backend |
| Chaloupes | GET | `/chaloupes/maintenance` | chaloupesService.getMaintenanceChaloupes | à confirmer avec l'équipe backend |
| Chaloupes | GET | `/chaloupes/planning` | chaloupesService.getPlanningChaloupes | à confirmer avec l'équipe backend |
| Tarifs | GET | `/tarifs/categories` | tarifsService.listCategoriesTarifs | à confirmer avec l'équipe backend |
| Tarifs | GET | `/tarifs/horaires` | tarifsService.listHorairesTarifs | à confirmer avec l'équipe backend |
| Tarifs | PUT | `/tarifs` | tarifsService.updateGrilleTarifs | à confirmer avec l'équipe backend |
| Paiements | GET | `/paiements/transactions` | paiementsService.listTransactions | à confirmer avec l'équipe backend |
| Paiements | GET | `/paiements/repartition` | paiementsService.getRepartitionPaiements | à confirmer avec l'équipe backend |
| Paiements | GET | `/paiements/:methode` | paiementsService.listPaiementsMethode | à confirmer avec l'équipe backend |
| Wallet | GET | `/wallet/solde` | walletService.getSoldeWallet | à confirmer avec l'équipe backend |
| Wallet | GET | `/wallet/mouvements` | walletService.listMouvements | à confirmer avec l'équipe backend |
| Wallet | GET | `/wallet/rechargements` | walletService.listRechargements | à confirmer avec l'équipe backend |
| Wallet | GET | `/wallet/debits` | walletService.listDebits | à confirmer avec l'équipe backend |
| Résidents | GET | `/residents` | residentsService.listDemandesResidents | à confirmer avec l'équipe backend |
| Résidents | GET | `/residents/en-attente` | residentsService.listDemandesEnAttente | à confirmer avec l'équipe backend |
| Résidents | GET | `/residents/refusees` | residentsService.listDemandesRefusees | à confirmer avec l'équipe backend |
| Résidents | GET | `/residents/historique` | residentsService.listDemandesHistorique | à confirmer avec l'équipe backend |
| Résidents | PATCH | `/residents/:id` | residentsService.traiterDemande | à confirmer avec l'équipe backend |
| Notifications | GET | `/notifications` | notificationsService.listNotifications | à confirmer avec l'équipe backend |
| Notifications | POST | `/notifications` | notificationsService.envoyerNotification | à confirmer avec l'équipe backend |
| Notifications | GET | `/notifications/sms` | notificationsService.listSms | à confirmer avec l'équipe backend |
| Notifications | GET | `/notifications/email` | notificationsService.listEmails | à confirmer avec l'équipe backend |
| Notifications | GET | `/notifications/push` | notificationsService.listPush | à confirmer avec l'équipe backend |
| Notifications | GET | `/notifications/in-app` | notificationsService.listInApp | à confirmer avec l'équipe backend |
| Notifications | GET | `/notifications/historique` | notificationsService.getHistoriqueNotifications | à confirmer avec l'équipe backend |
| Auth | POST | `/auth/login` | useAuthStore.login (laravelClient) | à confirmer avec l'équipe backend |

## Notes
- Les services `controleurs` utilisent `goClient` (temps réel / Go) ; tous les
  autres utilisent `laravelClient` (Laravel).
- Les données mockées de `src/app/data/mock/dashboard.mock.ts` sont conservées
  et ne sont pas supprimées.
