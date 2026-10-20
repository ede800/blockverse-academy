# ⬡ Blockverse Academy

> Un parcours interactif et gratuit pour s'initier aux cryptomonnaies, des bases de la blockchain jusqu'aux rollups de layer 2.

**🌐 Site en ligne : https://ede800.github.io/blockverse-academy/**

Blockverse Academy explique la mécanique de la crypto sans jargon inutile et sans promesse de gains. Chaque concept vient avec une analogie, un schéma ou une **simulation que l'on peut manipuler**, plus un quiz pour vérifier ce qu'on a compris.

## 🧭 Le parcours

| Niveau | Module | Démo interactive |
|---|---|---|
| **01 · Fondamentaux** | 01 · Pourquoi la crypto ? | — |
| | 02 · Hachage & cryptographie | SHA-256 en direct + effet avalanche |
| | 03 · La blockchain, bloc par bloc | Blockchain minable, falsification en cascade |
| | 04 · Le consensus : PoW & PoS | Tirage au sort pondéré par la mise |
| | 05 · Wallets, clés & adresses | Générateur de trousseau (simulation) |
| **02 · Intermédiaire** | 06 · Bitcoin en profondeur | Halvings et offre de BTC |
| | 07 · Ethereum & l'EVM | Calculateur de frais de gas (EIP-1559) |
| | 08 · Les smart contracts | Contrat « Cagnotte » à appeler |
| | 09 · Tokens, stablecoins & NFT | — |
| **03 · Avancé** | 10 · La DeFi | AMM x·y=k avec impact de prix |
| | 11 · Les layers : L0, L1, L2, L3 | Pile des layers + économie d'un rollup |
| | 12 · Bridges, oracles & interopérabilité | Bridge lock & mint (et son hack) |
| | 13 · Sécurité, MEV & arnaques | Anatomie d'une attaque sandwich |

Plus un **lexique** de plus de 80 termes, avec recherche.

## ✨ Fonctionnalités

- Design futuriste néon : réseau de nœuds animé, grille en perspective, cube de hashes en 3D
- Démos qui tournent entièrement dans le navigateur (vrai SHA-256 implémenté en JS)
- Quiz à la fin de chaque module
- Progression sauvegardée en local (`localStorage`), sans compte ni tracking
- Responsive (mobile → desktop) et respect de `prefers-reduced-motion`
- 100 % statique : HTML, CSS et JavaScript, sans build ni dépendance

## 🚀 Lancer en local

Aucune installation nécessaire : ouvrir `index.html` dans un navigateur suffit. Pour un serveur local :

```bash
python -m http.server 8000
```

puis ouvrir http://localhost:8000.

## 📁 Structure

```
├── index.html          # accueil + parcours
├── lexique.html        # glossaire avec recherche
├── modules/            # les 13 modules de cours
├── css/style.css       # thème néon
└── js/
    ├── main.js         # layout, progression, quiz, fond animé
    ├── demos.js        # démos interactives
    └── sha256.js       # implémentation SHA-256
```

## 🌍 Déploiement

Le site est servi par **GitHub Pages** depuis la branche `main` (dossier racine). Le fichier `.nojekyll` désactive le traitement Jekyll.

## ⚠️ Avertissement

Ce projet est purement éducatif. **Rien ici ne constitue un conseil en investissement.** Les cryptoactifs sont volatils et risqués. Les démos sont des simulations simplifiées : n'utilisez jamais les clés générées pour de vrais fonds.

## 📄 Licence

[MIT](LICENSE)
