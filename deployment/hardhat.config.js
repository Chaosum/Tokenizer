// ============================================================
//  Hardhat Configuration — Mat42Coin
//  Réseau cible : Ethereum Sepolia Testnet
//
//  Pour utiliser ce fichier :
//  1. npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
//  2. Créer un fichier .env avec tes variables (voir README)
//  3. npx hardhat run scripts/deploy.js --network sepolia
// ============================================================

require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  // Version du compilateur Solidity utilisée
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,   // Active l'optimiseur de bytecode
        runs: 200        // Optimise pour 200 exécutions (bon compromis déploiement/usage)
      }
    }
  },

  networks: {
    // --- Réseau local Hardhat (tests rapides sans Internet) ---
    hardhat: {
      chainId: 31337
    },

    // --- Sepolia Testnet (réseau de test Ethereum public) ---
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "",   // URL RPC fournie par Alchemy ou Infura
      accounts: process.env.PRIVATE_KEY         // Clé privée de ton wallet de déploiement
        ? [process.env.PRIVATE_KEY]
        : [],
      chainId: 11155111
    }
  },

  // Etherscan — permet de vérifier le contrat automatiquement après déploiement
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY || ""
  }
};
