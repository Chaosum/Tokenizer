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
