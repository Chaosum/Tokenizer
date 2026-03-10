// deploy.js
// Usage: npx hardhat run scripts/deploy.js --network sepolia

const { ethers } = require("hardhat");

async function main() {
  const factory = await ethers.getContractFactory("Mat42Coin");
  const contract = await factory.deploy();
  await contract.waitForDeployment();
  console.log(await contract.getAddress());
}

main().catch(console.error);