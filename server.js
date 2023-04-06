const {addAccountToWallet} = require('./modules/addAccountToWallet')
const {createAccount} = require('./modules/createAccount')
const {createHdWallet} = require('./modules/createHdWallet')
const {transfer} = require('./modules/transfer')
const express = require('express')
const cors = require('cors')
const app = express()
const router = express.Router()
const PORT = process.env.port || 4000

// Middlewares
app.use(cors())

/* ----- Define Routes ----- */

// Landing Route
router.get("/", (req,res) => {
    res.send("<h1>Server On!!!</h1>")
})

// POST Request: Create Wallet Instance
router.post('/wallet/create', async (req,res) => {
    try {
        const newWallet = await createHdWallet()
        console.log(newWallet)
        res.status(200).json(newWallet)
    } 
    catch(error) {
        res.status(500).send(error.message)
    }
    
})





app.use('/', router)

app.listen(PORT, ()=> {
    console.log(`Server listening on ${PORT}`)
})