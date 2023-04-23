const Config = require(".././config");
const { utils } = require('ethers');
const { ethers } = require('ethers');

// Use the provider for the local Ganache instance
const provider = new ethers.providers.JsonRpcProvider(Config.networkProvider);

async function importWallet(seedPhrase) {
  // Create a Wallet instance with the provided mnemonic
  const wallet = ethers.Wallet.fromMnemonic(seedPhrase).connect(provider)

  // Extract the seed phrase, account private key, public address, and the signTransaction function from the "Etherjs Wallet" instance
  const mnemonic = wallet.mnemonic.phrase;
  const privateKey = wallet.privateKey;
  const address = wallet.address;
  const signTransaction = wallet.signTransaction.bind(wallet);
  const sendTransaction = wallet.sendTransaction.bind(wallet);

  // Return the extracted info to the function caller
  return {
    mnemonic: mnemonic,
    privateKey: privateKey,
    address: address,
    signTransaction: signTransaction ,
    sendTransaction: sendTransaction ,
  };
}

module.exports = {
  importWallet
}

/* Example usage
const mnemonic = 'stumble bean velvet aspect ocean come tuition lyrics cave weird warm dust'
importWallet(mnemonic).then((results) => {
  console.log(results);
}).catch((error) => {
  console.error(error);
});

tx = {
  to: "0x686a0430dec8E9f2473cA97D7A5735047757400F",
  value: utils.parseEther("0.0000000007")
}

async function importTestWallet() {
  const importedWallet = await importWallet("divorce cactus virtual unfold that kitchen crystal illegal act aspect rude faculty")
  console.log(importedWallet)
  const txn = await importedWallet.sendTransaction(tx)
  console.log(txn)
}

importTestWallet()


*/

