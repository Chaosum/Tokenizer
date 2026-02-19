// ============================================================
//  Script de déploiement — Mat42Coin
//  Réseau : Ethereum Sepolia Testnet
//
//  Usage :
//    npx hardhat run scripts/deploy.js --network sepolia
//
//  Prérequis :
//    - Avoir complété le fichier .env (voir .env.example)
//    - Avoir des ETH de test Sepolia (faucet : https://sepoliafaucet.com)
// ============================================================

const { ethers } = require("hardhat");

async function main() {

  // Récupère le compte qui va signer la transaction de déploiement
  const [deployer] = await ethers.getSigners();

  console.log("==============================================");
  console.log("  Déploiement de Mat42Coin");
  console.log("==============================================");
  console.log(`  Compte déployeur  : ${deployer.address}`);

  // Affiche le solde du déployeur avant déploiement
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log(`  Solde ETH         : ${ethers.formatEther(balance)} ETH`);
  console.log("----------------------------------------------");

  // Compile et récupère la factory du contrat Mat42Coin
  const Mat42Coin = await ethers.getContractFactory("Mat42Coin");

  console.log("  Déploiement en cours...");

  // Déploie le contrat (envoie la transaction sur la blockchain)
  const mat42Coin = await Mat42Coin.deploy();

  // Attend que le contrat soit miné (au moins 1 confirmation)
  await mat42Coin.waitForDeployment();

  const contractAddress = await mat42Coin.getAddress();

  console.log("==============================================");
  console.log("  ✅ Mat42Coin déployé avec succès !");
  console.log(`  Adresse du contrat : ${contractAddress}`);
  console.log(`  Réseau             : Sepolia Testnet (chainId: 11155111)`);
  console.log(`  Explorer           : https://sepolia.etherscan.io/address/${contractAddress}`);
  console.log("==============================================");
  console.log("");
  console.log("  ➡️  Prochaine étape : vérifier le contrat sur Etherscan");
  console.log(`  npx hardhat verify --network sepolia ${contractAddress}`);
  console.log("==============================================");
}

// Point d'entrée du script avec gestion des erreurs
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Erreur lors du déploiement :", error);
    process.exit(1);
  });
