import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";

const config: HardhatUserConfig = {
  solidity: {
    version: "0.8.10",
    settings: {
      optimizer: {
        enabled: true,
        runs: 1
      },
      evmVersion: "london"
    }
  },
  // defaultNetwork: "bsc-testnet",
  networks: {
    local: {
      url: "http://localhost:4545/",
      chainId: 20072,
      gas: 4700000,
      // blockGasLimit: 210000000000000000000,
      // hardfork: "byzantium",
      accounts: ["e2631fdc520b622abf4f802b9177a739b58ae427b63ab7caa58ac26fb84460ee"]
    }
  }
};

export default config;
