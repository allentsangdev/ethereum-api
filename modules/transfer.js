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