const Block = require('./block')

class Blockchain {
    constructor() {
        this.chain = [Block.genesis()]
    }

    addBlock({ block, transactionQueue }){
        return new Promise((resolve, reject) => {
            Block.validateBlock({
                lastBlock: this.chain[this.chain.length - 1],
                block
            }).then(() => {
                this.chain.push(block)

                transactionQueue.clearBlockTransactions({
                    transactionSeries: block.transactionSeries
                })

                return resolve()
            }).catch(reject)
        })
    }

    replaceBlockchain({ chain }){
        console.log(chain)
        return new Promise(async (resolve, reject) => {
            for(let i = 0; i < chain.length; i++){
                const block = chain[i]
                const lastBlockIndex = i - 1
                const lastBlock =lastBlockIndex >= 0 ? chain[lastBlockIndex] : null

                try{
                    await Block.validateBlock({ lastBlock, block })
                } catch (err) {
                    return reject(err)
                }
            }

            this.chain = chain;

            return resolve()
        })
    }
}

module.exports = Blockchain
