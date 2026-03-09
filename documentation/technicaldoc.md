## Fonctions publiques

- name() — Retourne le nom du token ("Mat42Coin").
- symbol() — Retourne le ticker ("M42").
- decimals() — Nombre de décimales (18).
- totalSupply() — Supply totale en circulation.
- balanceOf(account) — Solde de `account`.
- allowance(owner, spender) — Montant que `spender` peut dépenser pour `owner`.

- transfer(recipient, amount) — Envoie `amount` du compte appelant à `recipient`. Revert si solde insuffisant ou adresse nulle. Émet `Transfer`.

- approve(spender, amount) — Autorise `spender` à dépenser `amount`. Émet `Approval`.

- transferFrom(sender, recipient, amount) — Déplace des fonds depuis `sender` vers `recipient` en consommant une allowance.

- mint(to, amount) — (onlyOwner) Crée des tokens pour `to`. Revert si dépasse `MAX_SUPPLY`.

- burn(amount) — Détruit `amount` du solde de l'appelant.

- owner() — Retourne l'adresse du propriétaire.

- transferOwnership(newOwner) — (onlyOwner) Transfère la propriété.

- renounceOwnership() — (onlyOwner) Renonce à la propriété (owner = 0).

---

## Fonctions internes

- _transfer(sender, recipient, amount) — logique de transfert et validation.
- _mint(to, amount) — augmente `_totalSupply` et le solde de `to`.
- _burn(from, amount) — décrémente `_balances[from]` et `_totalSupply`.
- _approve(owner, spender, amount) — met à jour `_allowances`.

## Events importants

- Transfer(from, to, value)
- Approval(owner, spender, value)
- Mint(to, amount)
- Burn(from, amount)
- OwnershipTransferred(previousOwner, newOwner)

---

## Déploiement

### Prérequis

- Node.js v18+
- Wallet avec ETH Sepolia (faucet)
- Clé API Alchemy ou Infura (RPC Sepolia)
- Clé API Etherscan (optionnel, vérification)

### Setup

Depuis `deployment/` :

```bash
npm install
```

Créer un fichier `.env` :

```env
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/<YOUR_API_KEY>
PRIVATE_KEY=0x...        # wallet déployeur (owner)
PRIVATE_KEY_2=0x...      # second wallet (demo.js uniquement)
ETHERSCAN_API_KEY=...    # optionnel
```

> Ne jamais commiter `.env`.

### Commandes

```bash
npm run compile          # compile le contrat → artifacts/
npm run deploy:local     # déploiement sur le réseau Hardhat local
npm run deploy:sepolia   # déploiement sur Sepolia (affiche l'adresse)
npm run verify -- --network sepolia <ADRESSE>   # vérifie sur Etherscan
npm run demo             # exécute demo.js sur Sepolia
```

---

## Code de déploiement

### `scripts/deploy.js`

```js
const factory = await ethers.getContractFactory("Mat42Coin"); // charge ABI + bytecode
const contract = await factory.deploy();                       // envoie la tx de création
await contract.waitForDeployment();                            // attend la confirmation
console.log(await contract.getAddress());                      // affiche l'adresse
```

Le constructeur de `Mat42Coin` ne prend aucun argument, donc `deploy()` est appelé sans paramètre.

### `hardhat.config.js`

- `paths.sources` pointe sur `../code/contracts` (contrats hors du dossier `deployment/`).
- Compilateur `0.8.20`, optimiseur activé avec `runs: 200` (compromis taille du bytecode / coût d'exécution).
- Deux réseaux : `hardhat` (chainId 31337, local) et `sepolia` (chainId 11155111).
- `SEPOLIA_RPC_URL` et `PRIVATE_KEY` sont lus depuis `.env` via `dotenv`.

### `scripts/demo.js`

Nécessite un contrat déjà déployé. Mettre à jour `CONTRACT_ADDRESS` dans le fichier avant exécution.

Le script instancie deux wallets (`wallet1` = owner, `wallet2` = tiers) depuis les variables d'env, puis enchaîne : affichage des infos du token, `transfer`, `approve`/`transferFrom`, `mint` et `burn`, avec les soldes affichés avant/après chaque opération.
