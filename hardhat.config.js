// ============================================================
//  Hardhat Configuration — Mat42Coin (project root)
//  This config lives at the repository root so `sources: "./code"`
//  keeps contracts inside /code as required.
// ============================================================

// Try to load hardhat-toolbox from root; if config is executed from deployment/
// where node_modules exists, fall back to that path so we don't need to install deps twice.
try {
  require("@nomicfoundation/hardhat-toolbox");
} catch (e) {
  // fallback to deployment node_modules
  try {
    require("./deployment/node_modules/@nomicfoundation/hardhat-toolbox");
  } catch (e2) {
    // if still failing, rethrow the original error to show useful message
    throw e;
  }
}

try {
  require("dotenv").config();
} catch (e) {
  // fallback to deployment node_modules
  try {
    require("./deployment/node_modules/dotenv").config();
  } catch (e2) {
    // ignore; env vars may be set externally
  }
}

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  paths: {
    // Look for solidity sources in the top-level `code` folder
    sources: "./code",
    // Place artifacts and cache inside the deployment folder so existing scripts keep working
    artifacts: "./deployment/artifacts",
    cache: "./deployment/cache",
    tests: "./deployment/test"
  },
  solidity: {
    version: "0.8.20",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  },
  networks: {
    hardhat: { chainId: 31337 },
    sepolia: {
      url: process.env.SEPOLIA_RPC_URL || "",
      accounts: process.env.PRIVATE_KEY ? [process.env.PRIVATE_KEY] : [],
      chainId: 11155111
    }
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY || ""
  }
};
