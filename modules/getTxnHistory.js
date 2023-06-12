import fetch from  "node-fetch"
const etherscanEndpoints = {
    mainnet: "https://api.etherscan.io/",
    goerli: "https://api-goerli.etherscan.io/",
    sepolia: "https://api-sepolia.etherscan.io/",
};
const etherscanApiKey = process.env.ETHERSCAN_API_KEY;

// Get a list of 'Normal' Transactions By Address

const getTxnHistory = async (address) => {
    const endpoint = `https://api-sepolia.etherscan.io/api?module=account&action=txlist&address=${address}&startblock=0&endblock=99999999&page=1&offset=10&sort=asc&apikey=${etherscanApiKey}`;

    const response = await fetch(endpoint);
    const history = await response.json();

    return history;
};

module.exports = {
    getTxnHistory
  }

//let address = "0x686a0430dec8E9f2473cA97D7A5735047757400F";
//getHistoty(address);
