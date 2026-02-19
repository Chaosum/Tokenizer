// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// ============================================================
//  Mat42Coin — ERC-20 Token
//  Standard : ERC-20 (Ethereum)
//  Author   : mservage (42 student)
// ============================================================

/**
 * @title IERC20
 * @dev Interface standard ERC-20.
 *      Tous les tokens ERC-20 doivent implémenter ces fonctions.
 */
interface IERC20 {
    /// @notice Retourne l'offre totale de tokens en circulation
    function totalSupply() external view returns (uint256);

    /// @notice Retourne le solde de tokens d'une adresse donnée
    /// @param account L'adresse à interroger
    function balanceOf(address account) external view returns (uint256);

    /// @notice Transfère des tokens vers une adresse
    /// @param recipient L'adresse destinataire
    /// @param amount Le montant à transférer
    function transfer(address recipient, uint256 amount) external returns (bool);

    /// @notice Retourne le montant qu'un spender est autorisé à dépenser pour le compte d'owner
    /// @param owner L'adresse propriétaire des tokens
    /// @param spender L'adresse autorisée à dépenser
    function allowance(address owner, address spender) external view returns (uint256);

    /// @notice Autorise un spender à dépenser un certain montant de tokens en ton nom
    /// @param spender L'adresse autorisée
    /// @param amount Le montant autorisé
    function approve(address spender, uint256 amount) external returns (bool);

    /// @notice Transfère des tokens depuis une adresse source vers une destination (via allowance)
    /// @param sender L'adresse source
    /// @param recipient L'adresse destinataire
    /// @param amount Le montant à transférer
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);

    /// @dev Émis lors d'un transfert de tokens (y compris la création initiale)
    event Transfer(address indexed from, address indexed to, uint256 value);

    /// @dev Émis lors d'un appel à approve()
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

// ============================================================
//  Ownable — Gestion de la propriété (ownership)
//  Permet de restreindre certaines fonctions au seul propriétaire
// ============================================================

/**
 * @title Ownable
 * @dev Fournit un mécanisme de contrôle d'accès basique :
 *      un compte "owner" peut être assigné et peut transférer la propriété.
 */
contract Ownable {
    /// @dev Adresse du propriétaire actuel du contrat
    address private _owner;

    /// @dev Émis lors d'un changement de propriétaire
    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    /**
     * @dev Définit le déployeur du contrat comme propriétaire initial.
     */
    constructor() {
        _owner = msg.sender;
        emit OwnershipTransferred(address(0), msg.sender);
    }

    /// @notice Retourne l'adresse du propriétaire actuel
    function owner() public view returns (address) {
        return _owner;
    }

    /**
     * @dev Modificateur qui restreint l'accès au propriétaire uniquement.
     *      Lève une exception si appelé par un autre compte.
     */
    modifier onlyOwner() {
        require(msg.sender == _owner, "Ownable: caller is not the owner");
        _;
    }

    /**
     * @notice Transfère la propriété du contrat à une nouvelle adresse.
     * @dev Réservé au propriétaire actuel. La nouvelle adresse ne peut pas être zéro.
     * @param newOwner La nouvelle adresse propriétaire
     */
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "Ownable: new owner is the zero address");
        emit OwnershipTransferred(_owner, newOwner);
        _owner = newOwner;
    }

    /**
     * @notice Renonce définitivement à la propriété du contrat.
     * @dev Attention : cette action est irréversible ! Plus personne ne pourra
     *      appeler les fonctions protégées par onlyOwner.
     */
    function renounceOwnership() public onlyOwner {
        emit OwnershipTransferred(_owner, address(0));
        _owner = address(0);
    }
}

// ============================================================
//  Mat42Coin — Implémentation ERC-20
// ============================================================

/**
 * @title Mat42Coin
 * @dev Token ERC-20 avec mécanisme de mint (création) réservé au propriétaire
 *      et mécanisme de burn (destruction) accessible à tous les détenteurs.
 *
 * Caractéristiques :
 *  - Nom    : Mat42Coin
 *  - Symbole: M42
 *  - Décimales: 18 (standard ERC-20)
 *  - Supply initiale: 1 000 000 M42 attribués au déployeur
 *  - Supply max: 10 000 000 M42 (plafond anti-inflation)
 */
contract Mat42Coin is IERC20, Ownable {

    // --- Métadonnées du token ---

    /// @dev Nom complet du token
    string private constant TOKEN_NAME     = "Mat42Coin";

    /// @dev Symbole (ticker) du token affiché sur les exchanges
    string private constant TOKEN_SYMBOL   = "M42";

    /// @dev Nombre de décimales (18 = standard ERC-20)
    uint8  private constant TOKEN_DECIMALS = 18;

    /// @dev Supply maximale autorisée : 10 000 000 tokens
    uint256 private constant MAX_SUPPLY = 10_000_000 * (10 ** 18);

    /// @dev Supply initiale : 1 000 000 tokens mintés au déployeur
    uint256 private constant INITIAL_SUPPLY = 1_000_000 * (10 ** 18);

    // --- État du contrat ---

    /// @dev Supply totale actuellement en circulation
    uint256 private _totalSupply;

    /// @dev Solde de chaque adresse
    mapping(address => uint256) private _balances;

    /// @dev Allowances : _allowances[owner][spender] = montant autorisé
    mapping(address => mapping(address => uint256)) private _allowances;

    // --- Événements spécifiques ---

    /// @dev Émis lors de la création de nouveaux tokens (mint)
    event Mint(address indexed to, uint256 amount);

    /// @dev Émis lors de la destruction de tokens (burn)
    event Burn(address indexed from, uint256 amount);

    // ============================================================
    //  Constructeur
    // ============================================================

    /**
     * @dev Déploie le contrat et mint la supply initiale vers le déployeur.
     *      Le déployeur devient automatiquement owner (via Ownable).
     */
    constructor() Ownable() {
        _mint(msg.sender, INITIAL_SUPPLY);
    }

    // ============================================================
    //  Fonctions de lecture (view) — ERC-20
    // ============================================================

    /// @notice Retourne le nom complet du token
    function name() public pure returns (string memory) {
        return TOKEN_NAME;
    }

    /// @notice Retourne le symbole (ticker) du token
    function symbol() public pure returns (string memory) {
        return TOKEN_SYMBOL;
    }

    /// @notice Retourne le nombre de décimales du token
    function decimals() public pure returns (uint8) {
        return TOKEN_DECIMALS;
    }

    /// @notice Retourne la supply totale actuellement en circulation
    function totalSupply() external view override returns (uint256) {
        return _totalSupply;
    }

    /// @notice Retourne le solde d'une adresse donnée
    /// @param account L'adresse à interroger
    function balanceOf(address account) external view override returns (uint256) {
        return _balances[account];
    }

    /// @notice Retourne le montant qu'un spender peut dépenser pour un owner
    /// @param tokenOwner L'adresse propriétaire des tokens
    /// @param spender L'adresse autorisée à dépenser
    function allowance(address tokenOwner, address spender) external view override returns (uint256) {
        return _allowances[tokenOwner][spender];
    }

    /// @notice Retourne la supply maximale autorisée
    function maxSupply() external pure returns (uint256) {
        return MAX_SUPPLY;
    }

    // ============================================================
    //  Fonctions d'écriture — ERC-20
    // ============================================================

    /**
     * @notice Transfère des tokens vers une adresse destinataire.
     * @dev L'appelant doit avoir un solde suffisant.
     * @param recipient L'adresse destinataire (non nulle)
     * @param amount    Le montant à transférer (en unités avec décimales)
     * @return true si le transfert a réussi
     */
    function transfer(address recipient, uint256 amount) external override returns (bool) {
        _transfer(msg.sender, recipient, amount);
        return true;
    }

    /**
     * @notice Autorise une adresse à dépenser des tokens en ton nom.
     * @dev Remplace toute allowance précédente.
     * @param spender L'adresse autorisée à dépenser
     * @param amount  Le montant autorisé
     * @return true si l'approbation a réussi
     */
    function approve(address spender, uint256 amount) external override returns (bool) {
        _approve(msg.sender, spender, amount);
        return true;
    }

    /**
     * @notice Transfère des tokens depuis une adresse source (via allowance).
     * @dev Réduit l'allowance du spender après transfert.
     * @param sender    L'adresse source
     * @param recipient L'adresse destinataire
     * @param amount    Le montant à transférer
     * @return true si le transfert a réussi
     */
    function transferFrom(address sender, address recipient, uint256 amount) external override returns (bool) {
        uint256 currentAllowance = _allowances[sender][msg.sender];
        require(currentAllowance >= amount, "ERC20: transfer amount exceeds allowance");
        _transfer(sender, recipient, amount);
        _approve(sender, msg.sender, currentAllowance - amount);
        return true;
    }

    // ============================================================
    //  Fonctions Owner — Mint
    // ============================================================

    /**
     * @notice Crée de nouveaux tokens et les envoie à une adresse.
     * @dev Réservé au propriétaire (onlyOwner). Ne peut pas dépasser MAX_SUPPLY.
     * @param to     L'adresse qui recevra les nouveaux tokens
     * @param amount Le montant à créer
     */
    function mint(address to, uint256 amount) external onlyOwner {
        require(_totalSupply + amount <= MAX_SUPPLY, "Mat42Coin: max supply exceeded");
        _mint(to, amount);
    }

    // ============================================================
    //  Fonctions publiques — Burn
    // ============================================================

    /**
     * @notice Détruit des tokens depuis ton propre solde.
     * @dev Réduit à la fois le solde et la supply totale.
     * @param amount Le montant à détruire
     */
    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }

    // ============================================================
    //  Fonctions internes
    // ============================================================

    /**
     * @dev Logique interne de transfert.
     *      Vérifie que ni sender ni recipient ne sont l'adresse zéro,
     *      et que le solde est suffisant.
     */
    function _transfer(address sender, address recipient, uint256 amount) internal {
        require(sender != address(0),    "ERC20: transfer from the zero address");
        require(recipient != address(0), "ERC20: transfer to the zero address");
        require(_balances[sender] >= amount, "ERC20: transfer amount exceeds balance");

        _balances[sender]    -= amount;
        _balances[recipient] += amount;

        emit Transfer(sender, recipient, amount);
    }

    /**
     * @dev Logique interne de mint (création de tokens).
     *      L'adresse destinataire ne peut pas être l'adresse zéro.
     */
    function _mint(address to, uint256 amount) internal {
        require(to != address(0), "ERC20: mint to the zero address");

        _totalSupply       += amount;
        _balances[to]      += amount;

        emit Transfer(address(0), to, amount);
        emit Mint(to, amount);
    }

    /**
     * @dev Logique interne de burn (destruction de tokens).
     *      L'adresse source doit avoir un solde suffisant.
     */
    function _burn(address from, uint256 amount) internal {
        require(from != address(0), "ERC20: burn from the zero address");
        require(_balances[from] >= amount, "ERC20: burn amount exceeds balance");

        _balances[from] -= amount;
        _totalSupply    -= amount;

        emit Transfer(from, address(0), amount);
        emit Burn(from, amount);
    }

    /**
     * @dev Logique interne d'approbation
     *      Ni owner ni spender ne peuvent être l'adresse zéro.
     */
    function _approve(address tokenOwner, address spender, uint256 amount) internal {
        require(tokenOwner != address(0), "ERC20: approve from the zero address");
        require(spender != address(0),    "ERC20: approve to the zero address");

        _allowances[tokenOwner][spender] = amount;

        emit Approval(tokenOwner, spender, amount);
    }
}
