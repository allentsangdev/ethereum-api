const { ethers } = require('ethers');

// Use the provider for the local Ganache instance
const provider = new ethers.providers.JsonRpcProvider('http://localhost:7545');

async function createWallet() {
  // Use the provider for the local Ganache instance
  const wallet = ethers.Wallet.createRandom().connect(provider);

  // Extract the seed phrase, account private key, public address, and the signTransaction function from the "Etherjs Wallet" instance
  const mnemonic = wallet.mnemonic.phrase;
  const privateKey = wallet.privateKey;
  const address = wallet.address;
  const signTransaction = wallet.signTransaction.bind(wallet);

  // Return the extracted info to the function caller
  return {
    mnemonic: mnemonic,
    privateKey: privateKey,
    address: address,
    signTransaction: signTransaction ,
  };
}

module.exports = {
  createWallet
}

/* Example usage
createWallet().then((result) => {
  console.log(result);
}).catch((error) => {
  console.error(error);
});
*/

/* Wallet Instance Created with EtherJs
{
  mnemonic: 'bench ski orbit device theme trap asthma claw mango ordinary hour such',
  privateKey: '0x0597f731edf9c0b2373f0290b09bee3a6ad39b37a1202700a82cb921acc672c7',
  address: '0x6f3f74288ce45e1a1EA1cA3af2747bE4afFCDb95',
  signTransaction: [Function: bound ]
}
*/