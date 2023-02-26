require('dotenv').config()

const PubNub = require('pubnub')

const credentials = {
    publishKey: process.env.PUBLISH_KEY,
    subscribeKey: process.env.SUBSCRIBE_KEY,
    secretKey: process.env.SECRET_KEY,
    userId: process.env.USER_ID
}

const CHANNELS_MAP = {
    TEST: 'TEST',
    BLOCK: 'BLOCK'
}

class PubSub {
    constructor({ blockchain }) {
        this.blockchain = blockchain
        this.pubnub = new PubNub(credentials)
        this.subscribeToChannels()
        this.listen()
    }

    subscribeToChannels() {
        this.pubnub.subscribe({
            channels: Object.values(CHANNELS_MAP)
        })
    }

    publish({ channel, message }) {
        this.pubnub.publish({ channel, message })
    }

    listen() {
        this.pubnub.addListener({
            message: (messageObject) => {
                const { channel, message } = messageObject
                const parsedMessage = JSON.parse(message)
                console.log('Message recived. Channel:', channel)

                switch(channel) {
                    case CHANNELS_MAP.BLOCK:
                        console.log('block message', message)
                        this.blockchain.addBlock({ block: parsedMessage})
                            .then(() =>console.log('New block accepted'))
                            .catch(err => console.error(err))
                        break
                    default:
                        return
                }
            } 
        })
    }

    broadcastBlock(block) {
        this.publish({
            channel: CHANNELS_MAP.BLOCK,
            message: JSON.stringify(block)
        })
    }
}

module.exports = PubSub
