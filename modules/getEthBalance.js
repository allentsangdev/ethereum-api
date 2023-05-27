const Config = require(".././config");
const { ethers } = require('ethers');

const provider = new ethers.providers.JsonRpcProvider(Config.networkProvider);

const getEthBalance = async (address) => {
    const balance = await provider.getBalance(address)
    const balanceInEth = ethers.utils.formatEther(balance)
    return balanceInEth
}

module.exports = {
    getEthBalance
  }