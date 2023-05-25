const {createWallet} = require('./modules/createWallet')
const {importWallet} = require('./modules/importWallet')
const { utils } = require('ethers');
const express = require('express')
const cors = require('cors')
const app = express()
const router = express.Router()
const PORT = process.env.port || 4000

// Middlewares
app.use(cors())
app.use(express.json())

/* ----- Define Routes ----- */

// Landing Route
router.get("/", (req,res) => {
    res.send("<h1>Server On!!!</h1>")
})

// POST Request: Create Wallet Instance
router.post('/wallet/create', async (req,res) => {
    try {
        const newWallet = await createWallet()
        console.log(newWallet)
        res.status(200).json(newWallet)
    } 
    catch(error) {
        res.status(500).send(error.message)
    }
})

// GET Request: Recover a wallet
router.get('/wallet/import/:seedphrase', async (req,res) => {
    try {
        const seedPhrase = req.params.seedphrase
        const wallet = await importWallet(seedPhrase)
        console.log(wallet)
        res.status(200).json(wallet)
    } 
    catch(error) {
        res.status(500).send(error.message)
    }
})

// POST Request: Transaction
router.post('/wallet/transaction', async (req,res) => {
    try {
        const {seedPhrase, destinationAddress, txAmount } = req.body
        const tx = {
            to:destinationAddress,
            value: utils.parseEther(txAmount)
        }
        const wallet = await importWallet(seedPhrase)
        const txReceipt = await wallet.sendTransaction(tx)
        res.status(200).json(txReceipt)

    } 
    catch(error) {
        res.status(500).send(error.message)
    }
})

app.use('/', router)

app.listen(PORT, ()=> {
    console.log(`Server listening on ${PORT}`)
})