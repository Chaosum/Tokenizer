# Tokenizer — Mat42Coin (M42)

## Présentation

Ce projet consiste en la création d'un token numérique (**Mat42Coin**, ticker `M42`) sur la blockchain **Ethereum**, en suivant le standard **ERC-20**.

---

## Choix techniques et justifications

### Blockchain : Ethereum

**Pourquoi Ethereum ?**  
Ethereum est la blockchain de référence pour les smart contracts et les tokens. Le standard ERC-20 y est né et est le plus mature, le mieux documenté et le plus supporté par les outils (wallets, explorers, exchanges). L'écosystème d'outils de développement (Hardhat, Remix, Etherscan) est très riche.

**Réseau de test utilisé : Sepolia Testnet**  
Sepolia est le testnet officiel recommandé par la fondation Ethereum

### Langage : Solidity

Solidity est le langage natif des smart contracts sur Ethereum

### Framework de déploiement : Hardhat

Hardhat est le framework de développement Ethereum le plus utilisé en 2024-2026. Il permet de :
- Compiler les contrats Solidity
- Tester localement sur un réseau Hardhat intégré
- Déployer sur n'importe quel réseau EVM via des scripts JavaScript
- Vérifier automatiquement les contrats sur Etherscan

### Standard : ERC-20

Le standard ERC-20 définit une interface commune pour les tokens fongibles sur Ethereum. En l'implémentant, `Mat42Coin` est immédiatement compatible avec tous les wallets (MetaMask), DEX et explorers qui supportent ERC-20.

### Implémentation sans dépendances externes (OpenZeppelin)

Le contrat est écrit **from scratch** sans importer OpenZeppelin, pour démontrer la compréhension du standard ERC-20 et du mécanisme d'ownership. Toutes les fonctions sont documentées avec NatSpec (format de documentation standard Solidity).

---

## Structure du dépôt

\`\`\`
.
├── README.md               ← Ce fichier
├── code/
│   └── Mat42Coin.sol       ← Smart contract ERC-20 (Solidity)
├── deployment/
│   ├── hardhat.config.js   ← Configuration Hardhat
│   ├── package.json        ← Dépendances npm
│   ├── .env.example        ← Modèle de variables d'environnement
│   └── scripts/
│       └── deploy.js       ← Script de déploiement
└── documentation/
    └── whitepaper.md       ← Documentation complète du token
\`\`\`

---

## Informations de déploiement

| Champ | Valeur |
|---|---|
| **Token** | Mat42Coin (M42) |
| **Standard** | ERC-20 |
| **Réseau** | Ethereum Sepolia Testnet |
| **Adresse du contrat** | `0xC0321F0053610207D92FE2C7FBdd6796310eBb3A` |
| **Lien Etherscan** | https://sepolia.etherscan.io/address/0xC0321F0053610207D92FE2C7FBdd6796310eBb3A |

---

## Fonctionnalités principales

- ✅ Standard ERC-20 complet (`transfer`, `approve`, `transferFrom`, `allowance`)
- ✅ Supply initiale de **1 000 000 M42** mintée au déployeur
- ✅ Supply maximale plafonnée à **10 000 000 M42**
- ✅ `mint()` réservé au propriétaire (ownership)
- ✅ `burn()` accessible à tout détenteur
- ✅ Transfert et renonciation de l'ownership
- ✅ Code commenté avec NatSpec
