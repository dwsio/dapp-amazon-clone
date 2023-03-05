import "@nomicfoundation/hardhat-toolbox";
import "@nomiclabs/hardhat-etherscan";
import { config as dotenvConfig } from "dotenv";
import type { HardhatUserConfig } from "hardhat/config";
import type {
  NetworkUserConfig,
  HardhatNetworkAccountsUserConfig,
} from "hardhat/types";
import { resolve } from "path";

const dotenvConfigPath: string = process.env.DOTENV_CONFIG_PATH || "./.env";
dotenvConfig({ path: resolve(__dirname, dotenvConfigPath) });

const mnemonic: string | undefined = process.env.MNEMONIC;
if (!mnemonic) {
  throw new Error("Please set your MNEMONIC in a .env file");
}

const alchemyApiKey: string | undefined = process.env.ALCHEMY_API_KEY;
if (!alchemyApiKey) {
  throw new Error("Please set your INFURA_API_KEY in a .env file");
}

const accountPrivKey: string = process.env.ACCOUNT_PRIV_KEY || "";
if (!accountPrivKey) {
  throw new Error("Please set your ACCOUNT_PRIV_KEY in a .env file");
}

const chainIds = {
  hardhat: 31337,
  mainnet: 1,
  goerli: 5,
  localhost: 1337,
};

function getChainConfig(chain: keyof typeof chainIds): NetworkUserConfig {
  let jsonRpcUrl = "https://eth-goerli.g.alchemy.com/v2/" + alchemyApiKey;

  return {
    accounts: [
      {
        privateKey: accountPrivKey,
        balance: "0",
      },
    ],
    chainId: chainIds[chain],
    url: jsonRpcUrl,
  };
}

const config: HardhatUserConfig = {
  defaultNetwork: "hardhat",
  etherscan: {
    apiKey: {
      mainnet: process.env.ETHERSCAN_API_KEY || "",
      goerli: process.env.ETHERSCAN_API_KEY || "",
      sepolia: process.env.ETHERSCAN_API_KEY || "",
    },
  },
  networks: {
    hardhat: {
      allowUnlimitedContractSize: true,
      accounts: {
        initialIndex: 0,
        mnemonic: process.env.MNEMONIC,
        path: "m/44'/60'/0'/0",
        count: 10,
        accountsBalance: "10000000000000000000000",
      },
      chainId: chainIds.hardhat,
    },
    mainnet: getChainConfig("mainnet"),
    goerli: getChainConfig("goerli"),
  },
  paths: {
    artifacts: "./artifacts",
    cache: "./cache",
    sources: "./contracts",
    tests: "./test",
  },
  solidity: {
    version: "0.8.18",
    settings: {
      metadata: {
        bytecodeHash: "none",
      },
      optimizer: {
        enabled: true,
        runs: 800,
      },
    },
  },
};

export default config;
