const express = require('express')
const request = require('request')
const bodyParser = require('body-parser')

const Blockchain = require('../blockchain')
const Block = require('../blockchain/block')
const PubSub = require('./pubsub')
const Transaction = require('../transaction')
const TransactionQueue = require('../transaction/transaction-queue')
const Account = require('../account')

const app = express()
const blockchain = new Blockchain()
const transactionQueue = new TransactionQueue()
const account = new Account()
const transaction = Transaction.createTransaction({ account })
const pubSub = new PubSub({ blockchain, transactionQueue })

setTimeout(() => {
    pubSub.broadcastTransaction(transaction)
}, 3000)

app.use(bodyParser.json())

app.get('/blockchain', (req, res, next) => {
    const { chain } = blockchain

    res.json({ chain })
})

app.get('/blockchain/mine', (req, res, next) => {
    const lastBlock = blockchain.chain[blockchain.chain.length - 1]
    const block = Block.mineBlock({ 
        lastBlock,
        beneficiary: account.address,
        transactionSeries: transactionQueue.getTransactionSeries()
    })

    blockchain
        .addBlock({ block, transactionQueue })
        .then(() => {
            pubSub.broadcastBlock(block)
            res.json({ block })
        })
        .catch(next)
})

app.post('/account/transact', (req, res, next) => {
    const { to, value } = req.body

    const transaction = Transaction.createTransaction({
        account: !to ? new Account() : account, 
        to, 
        value
    })

    pubSub.broadcastTransaction(transaction)

    res.json({ transaction })
})

app.use((err, req, res, next) => {
    console.error(`Internal server error: ${err}`)

    res
        .status(500)
        .json({ message: err.message })
})

const peer = process.argv.includes('--peer')

const PORT = 
    peer 
        ? Math.floor(2000 + Math.random() * 1000) 
        : 3000

if(peer) {
    request('http://localhost:3000/blockchain', (err, response, body) => {
        const { chain } = JSON.parse(body)

        blockchain
            .replaceBlockchain({ chain })
            .then(() => console.log('Synchronized blockchain with the root node'))
            .catch((err) => console.error(`Failed to synchornize the blockchain: ${err.message}`))
    })
}

app.listen(PORT, () => console.log(`listening at PORT: ${PORT}`))
