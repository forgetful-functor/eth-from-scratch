const { keccakHash } = require('../util')
const Block = require('./block')

describe('Block', () => {
    describe("calculateBlockTargetHash()", () => {
        it('caculates maximum hash when the last block diff is 1', () => {
            expect(
                Block.calculateBlockTargetHash( { lastBlock: {blockHeaders: { difficulty: 1 } } })
            ).toEqual('f'.repeat(64))
        })

        it('calculates a low hash value when the last block diff is high', () => {
            expect(
                Block.calculateBlockTargetHash( { lastBlock: {blockHeaders: { difficulty: 5e20 } } }) < '1'
            ).toBe(true)
        })
    })

    describe('mineBlock()', () => {
        let lastBlock, minedBlock

        beforeEach(() => {
            lastBlock = Block.genesis()
            minedBlock = Block.mineBlock({ lastBlock, beneficiary: 'beneficiary'})
        })

        it('mines a block', () => {
            expect(minedBlock).toBeInstanceOf(Block)
        })

        it('mines a block that reads the proof of work requirement', () => {
            const target = Block.calculateBlockTargetHash( {lastBlock })
            const { blockHeaders } = minedBlock
            const { nonce } = blockHeaders
            const truncatedBlockHeaders = { ...blockHeaders }
            delete truncatedBlockHeaders.nonce

            const header = keccakHash(truncatedBlockHeaders)
            const underTargetHash = keccakHash( header + nonce)

            expect(underTargetHash < target).toBe(true)
        })
    })
})