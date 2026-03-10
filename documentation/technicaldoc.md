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

### Setup

```bash
npm install
```

Créer un fichier `.env` :

```env
SEPOLIA_RPC_URL=https://11155111.rpc.thirdweb.com/
PRIVATE_KEY=0x...        # wallet déployeur (owner)
PRIVATE_KEY_2=0x...      # second wallet (demo.js uniquement)
```


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

