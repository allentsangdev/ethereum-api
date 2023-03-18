const addAccountToWallet = require('./modules/addAccountToWallet')
const createAccount = require('./modules/createAccount')
const createWallet = require('./modules/createWallet')
const transfer = require('./modules/transfer')

const express = require('express')
const app = express()
const PORT = 3000

app.get("/", (req,res) => {
    res.send("<h1>Server On!!!</h1>")
})

app.listen(PORT, ()=> {
    console.log('I am listening too')
})