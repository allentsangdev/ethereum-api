// Importing Config file
const Config = require(".././config");
// Adding web3.js into project
const Web3 = require("web3");
// Create web3 instance
let web3 = new Web3(Config.networkProvider);

// @dev note that _txValue in wei
async function transfer(_txToAddress, _txValue, _txGasLimit, _txPrivateKey) {

    const signTxnParams = {
        to: _txToAddress,
        value: _txValue,
        gas: _txGasLimit 
    }

    // sign the transaction
    const transactionSignature = await web3.eth.accounts.signTransaction(signTxnParams, _txPrivateKey)

    // send the signed transaction
    const transfer = await web3.eth.sendSignedTransaction(transactionSignature.rawTransaction)
    
    console.log(transfer)
    // return the transaction receipt
    return transfer

}

module.exports = {
    transfer
}

/* Example Usage
transfer("0x6f3f74288ce45e1a1EA1cA3af2747bE4afFCDb95", "5000000000000000000", "21000", "fa7c87c8722fd950e7901e478a3eaa3de81c478a98c21e5a5ee8b8470ed4d912" )
*/