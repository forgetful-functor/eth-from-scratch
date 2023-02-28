const Transaction = require('./index')
const Account     = require('../account')

describe('Transaction', () => {
    let account, standardTransaction, createAccountTransaction
    
    beforeEach(() => {
        account = new Account()
        standardTransaction = Transaction.createTransaction({
            account,
            to: 'foo-recipient',
            value: 50
        })

        createAccountTransaction = Transaction.createTransaction({
            account
        })
    })

    describe('validateStandardTransaction', () => {
        it('validates a valid transaction', () => {
            expect(
               () => Transaction.validateStandardTransaction({ standardTransaction })
            ).resolves
        })

        it('it does not validate a malformed transaction', () => {
            standardTransaction.to = 'bar-recipient'

            expect(
               () => Transaction.validateStandardTransaction({ standardTransaction })
            ).rejects
        })
    })

    describe('validateCreateAccountTransaction()', () => {
        it('validates a create account transaction', () => {
            expect(
                () => Transaction.validateCreateAccountTransactions({ createAccountTransaction })
            ).resolves
        })

        it('does not validate a non create account transaction', () => {
            expect(
                Transaction.validateCreateAccountTransactions({ standardTransaction })
            ).rejects
        })
    })
})