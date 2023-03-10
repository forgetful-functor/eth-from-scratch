const { STARTING_BALANCE } = require('../config')
const { ec, keccakHash } = require('../util')

class Account {
    constructor(){
        this.keyPair = ec.genKeyPair()
        this.address = this.keyPair.getPublic().encode('hex')
        this.balance = STARTING_BALANCE
    }

    sign(data){
        return this.keyPair.sign(keccakHash(data))
    }

    static verifySignature({ publicKey, data, signature }){
        const keyFromPublic = ec.keyFromPublic(publicKey, 'hex')

        return keyFromPublic.verify(keccakHash(data), signature)
    }

    toJSON(){
        return {
            address: this.address,
            balance: this.balance
        }
    }
}

module.exports = Account