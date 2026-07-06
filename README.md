# Magnet Link Grabber

Extension Chrome qui récupère tous les liens magnet (`magnet:?xt...`) présents sur une page web, pour les copier facilement.

## Fonctionnalités

- Scanne les liens `<a href="magnet:?xt...">` de l'onglet actif
- Affiche la liste des liens trouvés dans une popup, avec le nom du torrent quand disponible (paramètre `dn=`)
- Bouton "Copier tout" pour copier tous les liens (un par ligne) dans le presse-papier
- Bouton "Copier" individuel pour chaque lien

## Installation (mode développeur)

1. Ouvrir `chrome://extensions`
2. Activer le "Mode développeur" (en haut à droite)
3. Cliquer sur "Charger l'extension non empaquetée"
4. Sélectionner le dossier de ce projet

## Utilisation

1. Ouvrir une page contenant des liens magnet
2. Cliquer sur l'icône de l'extension
3. Copier le(s) lien(s) souhaité(s)

## Structure du projet

- `manifest.json` — configuration de l'extension (Manifest V3)
- `popup.html` / `popup.css` / `popup.js` — interface et logique de la popup
- `icons/` — icônes de l'extension
