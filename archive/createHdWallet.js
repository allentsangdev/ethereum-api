/*
Requirements:
1. Create a wallet instance that is associated with an seed phrase,
   so that user can import wallet to other wallet services with the seed phrase
2. When wallet being created, one account will be generated and be added to the wallet instance
3. Able to add other accounts to the wallet
*/



const HDWalletProvider = require('@truffle/hdwallet-provider');
const Config = require("../config");
const Web3 = require('web3');
const bip39 = require('bip39');

async function createHdWallet() {
    // generate a 12 words seed phrase / mnemonic
    const mnemonic = bip39.generateMnemonic();
    // generate a HD wallet instance
    const provider = new HDWalletProvider({
    mnemonic: {
        phrase: mnemonic
    },
    //providerOrUrl: 'https://mainnet.infura.io/v3/your-project-id'
    providerOrUrl: Config.networkProvider,
    numberOfAddresses: 1
    });

    // initialize a web3 instance with HDWalletProvider
    const web3 = new Web3(provider);

    // extract the account addresses. This array will contain only one address 
    let accountAddresses = await web3.eth.getAccounts()

    // return the wallet object back to the function caller
    let wallet =  {
        seed: mnemonic,
        address: accountAddresses[0] 
    }

    return wallet

}

module.exports = {
    createHdWallet
}

const test = createHdWallet().then(console.log)