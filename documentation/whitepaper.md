# Mat42Coin (M42) — Documentation

## Table des matières

1. [Présentation](#1-présentation)
2. [Caractéristiques techniques](#2-caractéristiques-techniques)
3. [Fonctionnement du token](#3-fonctionnement-du-token)
4. [Sécurité et ownership](#4-sécurité-et-ownership)
5. [Comment utiliser le token](#5-comment-utiliser-le-token)
6. [Déploiement](#6-déploiement)
7. [Informations de déploiement](#7-informations-de-déploiement)

---

## 1. Présentation

**Mat42Coin** (ticker : `M42`) est un token numérique créé dans le cadre du projet **Tokenizer** de l'école 42.  
Il est déployé sur la blockchain **Ethereum** en suivant le standard **ERC-20**, le standard le plus utilisé pour les tokens fongibles.

Un token **fongible** signifie que chaque unité est identique et interchangeable avec une autre : 1 M42 vaut toujours 1 M42, comme un billet de banque.

---

## 2. Caractéristiques techniques

| Propriété          | Valeur                          |
|--------------------|---------------------------------|
| **Nom**            | Mat42Coin                       |
| **Ticker**         | M42                             |
| **Standard**       | ERC-20                          |
| **Blockchain**     | Ethereum                        |
| **Réseau déployé** | Sepolia Testnet                 |
| **Décimales**      | 18                              |
| **Supply initiale**| 1 000 000 M42                   |
| **Supply maximale**| 10 000 000 M42                  |
| **Langage**        | Solidity ^0.8.20                |

> **Décimales = 18** : comme l'ETH est divisible en wei (1 ETH = 10^18 wei), M42 suit la même convention. Cela permet des transferts de fractions très petites.

---

## 3. Fonctionnement du token

### Fonctions ERC-20 standard

| Fonction | Description |
|---|---|
| `totalSupply()` | Retourne la quantité totale de tokens en circulation |
| `balanceOf(address)` | Retourne le solde d'une adresse |
| `transfer(to, amount)` | Envoie des tokens à une adresse |
| `approve(spender, amount)` | Autorise une adresse à dépenser des tokens en ton nom |
| `allowance(owner, spender)` | Consulte le montant qu'un spender peut dépenser |
| `transferFrom(from, to, amount)` | Transfère des tokens via une allowance préalablement accordée |

### Fonctions supplémentaires

| Fonction | Accès | Description |
|---|---|---|
| `mint(to, amount)` | Owner uniquement | Crée de nouveaux tokens (limité au MAX_SUPPLY) |
| `burn(amount)` | Tout détenteur | Détruit des tokens depuis son propre solde |
| `maxSupply()` | Public | Retourne la supply maximale autorisée |

### Événements émis

| Événement | Déclenché quand |
|---|---|
| `Transfer(from, to, value)` | Lors de tout transfert (y compris mint/burn) |
| `Approval(owner, spender, value)` | Lors d'un appel à `approve()` |
| `Mint(to, amount)` | Lors de la création de nouveaux tokens |
| `Burn(from, amount)` | Lors de la destruction de tokens |
| `OwnershipTransferred(prev, new)` | Lors d'un changement de propriétaire |

---

## 4. Sécurité et ownership

### Ownership (propriété du contrat)

Le contrat implémente un système d'**ownership** via le contrat `Ownable` :

- À la création du contrat, le **déployeur devient le propriétaire (owner)**.
- Seul l'owner peut appeler la fonction `mint()` pour créer de nouveaux tokens.
- L'owner peut **transférer la propriété** à une autre adresse via `transferOwnership(newOwner)`.
- L'owner peut **renoncer définitivement** à la propriété via `renounceOwnership()` — attention, cette action est **irréversible**.

### Protections implémentées

- **Vérification des adresses zéro** : aucune opération n'est autorisée vers/depuis `address(0)`.
- **Vérification des soldes** : un transfert ou un burn échoue si le solde est insuffisant.
- **Vérification des allowances** : un `transferFrom` échoue si l'allowance est insuffisante.
- **Plafond de supply** : la fonction `mint()` est bloquée si elle ferait dépasser `MAX_SUPPLY`.

---

## 5. Comment utiliser le token

### Prérequis

- Un wallet Ethereum (ex: [MetaMask](https://metamask.io))
- Des ETH de test Sepolia (gratuits via [https://sepoliafaucet.com](https://sepoliafaucet.com))

### Ajouter M42 dans MetaMask

1. Ouvrir MetaMask et se connecter au réseau **Sepolia**
2. Cliquer sur **"Import tokens"**
3. Entrer l'adresse du contrat (voir [section 7](#7-informations-de-déploiement))
4. Le ticker `M42` et les 18 décimales se remplissent automatiquement
5. Confirmer — le solde M42 apparaît dans MetaMask

### Transférer des M42

Via [Etherscan Sepolia](https://sepolia.etherscan.io) :

1. Chercher l'adresse du contrat
2. Aller dans l'onglet **"Write Contract"**
3. Se connecter avec MetaMask (bouton "Connect to Web3")
4. Appeler `transfer(recipient, amount)` en entrant le montant **avec 18 décimales**  
   Ex : pour envoyer 10 M42 → entrer `10000000000000000000`

---

## 6. Déploiement

### Outils utilisés

| Outil | Rôle |
|---|---|
| **Hardhat** | Framework de compilation et déploiement |
| **Solidity 0.8.20** | Langage du smart contract |
| **Alchemy** | Fournisseur RPC (accès au nœud Ethereum) |
| **Etherscan** | Explorer blockchain + vérification du contrat |
| **dotenv** | Gestion sécurisée des variables d'environnement |

### Étapes de déploiement

```bash
# 1. Se placer dans le dossier deployment
cd deployment

# 2. Installer les dépendances
npm install

# 3. Créer le fichier .env à partir du modèle
cp .env.example .env
# Remplir PRIVATE_KEY, SEPOLIA_RPC_URL, ETHERSCAN_API_KEY dans .env

# 4. Compiler le contrat
npm run compile

# 5. Déployer sur Sepolia
npm run deploy:sepolia

# 6. Vérifier le contrat sur Etherscan (optionnel mais recommandé)
npm run verify -- <ADRESSE_DU_CONTRAT>
```

---

## 7. Informations de déploiement

> ⚠️ Cette section sera mise à jour après le déploiement effectif.

| Champ | Valeur |
|---|---|
| **Réseau** | Ethereum Sepolia Testnet |
| **Chain ID** | 11155111 |
| **Adresse du contrat** | `0xC0321F0053610207D92FE2C7FBdd6796310eBb3A` |
| **Lien Etherscan** | https://sepolia.etherscan.io/address/0xC0321F0053610207D92FE2C7FBdd6796310eBb3A |
| **Bloc de déploiement** | *À renseigner après déploiement* |
| **Transaction de déploiement** | *À renseigner après déploiement* |
