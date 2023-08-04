// hardhat.config.js

require("dotenv").config()
require("@nomiclabs/hardhat-ethers")
 
module.exports = {
  solidity: "0.8.17",
  paths: {
    artifacts: './src/artifacts',
  },
  networks: {
    fuji: {
      url: process.env.ETHNODE_URL,
      accounts: [`0x` + process.env.PRIVATE_KEY],
      chainId: 11155111., // update the chainId to your Ethereum's ID
    },
  },
}