import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-ignition-ethers";
import "dotenv/config";

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: "0.8.26",
        settings: {
          evmVersion: "shanghai",
          optimizer: {
            enabled: true,
            runs: 200,
          },
        },
      },
    ],
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    sei_testnet: {
      url: "https://sei-testnet.g.alchemy.com/v2/", /// add alchemy api key
      accounts: process.env.PRIV_KEY ? [process.env.PRIV_KEY] : [],
      chainId: 1328,
    },
  },
  ...(process.env.SEI_SCAN_KEY && {
    etherscan: {
      apiKey: {
        sei_testnet: process.env.SEI_SCAN_KEY,
      },
      customChains: [
        {
          network: "sei_testnet",
          chainId: 1328,
          urls: {
            apiURL: "https://seitrace.com/api",
            browserURL: "https://seitrace.com/",
          },
        },
      ],
    },
  }),
  ignition: {
    requiredConfirmations: 1,
  },
};

export default config;
