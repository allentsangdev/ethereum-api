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
        phrase: "penalty layer donate like squeeze garden relax mail wild okay despair wrong"
    },
    //providerOrUrl: 'https://mainnet.infura.io/v3/your-project-id'
    providerOrUrl: Config.networkProvider,
    numberOfAddresses: 1
    });

    // initialize a web3 instance with HDWalletProvider
    const web3 = new Web3(provider);

    // create one account
    const firstAccount = web3.eth.accounts.create()

    // add the created account to the HdWallet
    web3.eth.accounts.wallet.add(firstAccount.privateKey);

    // check if account successfully added
    //console.log(mnemonic)
    //console.log(web3.eth.accounts.wallet)

    // extract the new account address.
    let accountAddresses = firstAccount.address

    // return the wallet object back to the function caller
    let wallet =  {
        seed: mnemonic,
        address: accountAddresses
    }

    console.log(web3.eth.accounts.wallet)

    return wallet

}

const x = createHdWallet()
