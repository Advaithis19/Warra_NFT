require("@nomicfoundation/hardhat-toolbox");
// require("@nomiclabs/hardhat-waffle");
require("dotenv").config();
// require("@nomiclabs/hardhat-etherscan");
// require("./tasks/block-number");
// require("hardhat-gas-reporter");
// require("solidity-coverage");

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
// task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
//     const accounts = await hre.ethers.getSigners()

//     for (const account of accounts) {
//         console.log(account.address)
//     }
// })

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

/**
 * @type import('hardhat/config').HardhatUserConfig
 */

// const RINKEBY_RPC_URL = process.env.RINKEBY_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;
// const ETHERSCAN_API_KEY = process.env.ETHERSCAN_API_KEY;
const POLYGONSCAN_API_KEY = process.env.POLYGONSCAN_API_KEY;
// const COINMARKETCAP_API_KEY = process.env.COINMARKETCAP_API_KEY;
module.exports = {
  defaultNetwork: "hardhat",
  networks: {
    // rinkeby: {
    //   url: RINKEBY_RPC_URL,
    //   accounts: [PRIVATE_KEY],
    //   chainId: 4,
    // },
    localhost: {
      url: "http://127.0.0.1:8545/",
      chainId: 31337,
    },
    matic: {
      url: "https://polygon-mumbai.g.alchemy.com/v2/iSoazNJDx5hcYQ17ud_qQtNCvsahnNB_",
      accounts: [process.env.PRIVATE_KEY],
    },
  },
  solidity: "0.8.7",
  etherscan: {
    apiKey: POLYGONSCAN_API_KEY,
  },
};
