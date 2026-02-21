# Tokenizer - Mat42Coin (M42)

## C'est quoi ce projet ?

Le but est de créer un token ERC-20 sur Ethereum.
Le token s'appelle Mat42Coin (M42).

J'ai fait le contrat en Solidity, puis le déploiement avec Hardhat sur Sepolia (une blockchain de test pour etherium).

## Pourquoi ces choix

- Ethereum : c'est la blockchain la plus utilisée pour les smart contracts.
- ERC-20 : standard classique pour les tokens fongibles.
- Sepolia : testnet simple à utiliser, pas besoin d'argent réel.
- Hardhat : pratique pour compiler et déployer rapidement.
- Ethers.js : pour communiquer avec la blockchain depuis les scripts.

## Commandes utiles

Compiler :

```bash
npm run compile
```

Déployer en local :

```bash
npm run deploy:local
```

Déployer sur Sepolia :

```bash
npm run deploy:sepolia
```

Lancer la démo (transfers / approve / etc.) :

```bash
npm run demo
```

Vérifier sur Etherscan :

```bash
npm run verify -- <CONTRACT_ADDRESS>
```

## Fonctions du token

ERC-20 de base :
- transfer
- approve
- transferFrom
- allowance
- balanceOf
- totalSupply

En plus :
- mint (réservé au owner)
- burn
- gestion de l'ownership
