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
})