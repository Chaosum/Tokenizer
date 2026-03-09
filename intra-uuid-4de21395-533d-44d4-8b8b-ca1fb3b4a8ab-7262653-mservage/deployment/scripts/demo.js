const { ethers } = require("hardhat");
const { abi: ABI } = require("../artifacts/contracts/Mat42Coin.sol/Mat42Coin.json");

// Adresse du contrat déjà déployé sur Sepolia
const CONTRACT_ADDRESS = "0xC0321F0053610207D92FE2C7FBdd6796310eBb3A";

async function main() {
  const provider = new ethers.JsonRpcProvider(process.env.SEPOLIA_RPC_URL);

  // Chargement des deux wallets
  const wallet1 = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
  const wallet2 = new ethers.Wallet(process.env.PRIVATE_KEY_2, provider);

  console.log("Comptes utilisés");
  console.log(`Compte 1 (owner/déployeur) : ${wallet1.address}`);
  console.log(`Compte 2                   : ${wallet2.address}`);

  const bal1ETH = await provider.getBalance(wallet1.address);
  const bal2ETH = await provider.getBalance(wallet2.address);
  console.log(`Solde ETH compte 1 : ${ethers.formatEther(bal1ETH)} ETH`);
  console.log(`Solde ETH compte 2 : ${ethers.formatEther(bal2ETH)} ETH`);

  // Instances du contrat
  const contract1 = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet1); // signé par compte1
  const contract2 = new ethers.Contract(CONTRACT_ADDRESS, ABI, wallet2); // signé par compte2

  // Infos du token
  console.log("Infos du token");
  console.log(`Nom          : ${await contract1.name()}`);
  console.log(`Symbole      : ${await contract1.symbol()}`);
  console.log(`Décimales    : ${await contract1.decimals()}`);
  console.log(`Owner        : ${await contract1.owner()}`);
  console.log(`Total Supply : ${ethers.formatUnits(await contract1.totalSupply(), 18)} M42`);
  console.log(`Max Supply   : ${ethers.formatUnits(await contract1.maxSupply(), 18)} M42`);

  // Fonctionnalités disponibles
  const showBalances = async () => {
    const b1 = await contract1.balanceOf(wallet1.address);
    const b2 = await contract1.balanceOf(wallet2.address);
    console.log(`  Compte 1 : ${ethers.formatUnits(b1, 18)} M42`);
    console.log(`  Compte 2 : ${ethers.formatUnits(b2, 18)} M42`);
  };
  const transfer = async (fromContract, to, amount) => {
    try {
      await showBalances();
      const transferAmount = ethers.parseUnits(amount, 18);
      await fromContract.transfer(to.address, transferAmount);
      await showBalances();
    } catch (err) {
      console.log(`Erreur lors du transfert : ${err.message}`);
    }
  };
  const approve = async (fromContract, from, to, amount) => {
    try
    {
      const approveAmount = ethers.parseUnits(amount, 18);
      await fromContract.approve(to.address, approveAmount);
      await showAllowance(fromContract, from, to);
    }
    catch (err) 
    {
      console.log(`Erreur lors de l'approbation : ${err.message}`);
      try
      {
        await showAllowance(fromContract, from, to);
      }
      catch (err2) 
      {
        console.log(`Erreur lors de l'affichage de l'allowance : ${err2.message}`);
      }
    }
  };
  const showAllowance = async (contract, from, to) => {
    const allowance = await contract.allowance(from.address, to.address);
    console.log(`Allowance ${from.address} → ${to.address} : ${ethers.formatUnits(allowance, 18)} M42`);
  }
  const transferFrom = async (fromContract, from, to, amount) => {
    await showBalances();
    try {
      const transferAmount = ethers.parseUnits(amount, 18);
      await fromContract.transferFrom(from.address, to.address, transferAmount);
    } catch (err) {
      console.log(`Erreur lors du transferFrom : ${err.message}`);
    }
    await showBalances();
  };

  const mint = async (contract, to, amount) => {
    try {
      const mintAmount = ethers.parseUnits(amount, 18);
      await contract.mint(to.address, mintAmount);
      await showBalances();
      console.log(`Total Supply : ${ethers.formatUnits(await contract.totalSupply(), 18)} M42`);
    } catch (err) {
      console.log(`Erreur lors du mint : ${err.message}`);
    }
   };
   const burn = async (contract, amount) => {
    try {
      const burnAmount = ethers.parseUnits(amount, 18);
      await contract.burn(burnAmount);
      await showBalances();
      console.log(`Total Supply : ${ethers.formatUnits(await contract.totalSupply(), 18)} M42`);
    } catch (err) {
      console.log(`Erreur lors du burn : ${err.message}`);
    }
   };
   const showOwner = async (contract) => {
    try {
      const owner = await contract.owner();
      console.log(`Propriétaire actuel : ${owner}`);
    } catch (err) {
      console.log(`Erreur lors de l'affichage du propriétaire : ${err.message}`);
    }
   };
   const transferOwnership = async (contract, newOwner) => {
    try {
      await contract.transferOwnership(newOwner.address);
      console.log(`Propriétaire transféré à ${newOwner.address}`);
      await showOwner(contract);
    } catch (err) {
      console.log(`Erreur lors du transfert de propriété : ${err.message}`);
    }
   };


  // Tests
  await transfer(contract1, wallet2, "100"); // 100 M42 du compte1 vers compte2
  await transfer(contract2, wallet1, "50"); // 50 M42 du compte2 vers compte1
  await transfer(contract1, wallet2, "100000"); // 100000 M42 du compte1 vers compte2 (doit échouer)

  await showAllowance(contract1, wallet2, wallet1);
  await approve(contract1, wallet1, wallet2, "51"); // 51 M42 du compte2 vers compte1
  await transferFrom(contract1, wallet2, wallet1, "50"); // 50 M42 du compte2 vers compte1 via transferFrom
  await transferFrom(contract1, wallet2, wallet1, "5000"); // 5000 M42 du compte2 vers compte1 via transferFrom
  await transferFrom(contract1, wallet2, wallet1, "1"); // 1 M42 du compte2 vers compte1 via transferFrom

  await mint(contract1, wallet2, "500"); // 500 M42 mintés par le owner pour compte2
  await mint(contract2, wallet2, "100"); // 100 M42 mintés par compte2 (doit échouer car pas owner)
  
  await burn(contract2, "200"); // 200 M42 burnés par compte2
  await burn(contract2, "100000"); // 100000 M42 burnés par compte2 (doit échouer car pas assez de balance);

  await showOwner(contract1);
  await transferOwnership(contract1, wallet2);
  await showOwner(contract1);
  await transferOwnership(contract1, wallet1);
  await showOwner(contract1);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error("Erreur :", err.message);
    process.exit(1);
  });
