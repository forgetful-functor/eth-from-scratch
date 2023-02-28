const request = require('request')

const BASE_URL = 'http://localhost:3000'

const postTransact = ({ to, value }) => {
    return new Promise((resolve, reject) => {
        request(`${BASE_URL}/account/transact`,
        {
            method: 'POST',
            headers: { 'Content-Type': 'application/json'},
            body: JSON.stringify({ to, value })
        },
        (error, response, body) => {
            if(error) return reject(error)
            return resolve(JSON.parse(body))
        })

    })
}

postTransact({})
    .then((postTransactionResponse) => {
        console.log('Create account transaction', postTransactionResponse)

        const toAccountData = postTransactionResponse.transaction.data.accountData;

        return postTransact({ to: toAccountData, value: 20 })
    })
    .then((postTransactionResponse2) => {
        console.log('Standard account transaction', postTransactionResponse2)
    })
    .catch(err => console.error(err))

