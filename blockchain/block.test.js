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

    describe('adjustDifficulty()', () => {
        it('keeps difficulty above 0', () => {
            expect(
                Block.adjustDifficulty({
                    lastBlock: { blockHeaders: { difficulty: 0 } },
                    timestamp: Date.now()
                })
            ).toEqual(1)
        })

        it('decreases difficulty if current block mined too slow', ()  => {
            expect(
                Block.adjustDifficulty({
                    lastBlock: { blockHeaders: { difficulty: 12, timestamp: Date.now() - 25 * 1000 } },
                    timestamp: Date.now()
                })
            ).toEqual(11)
        })


        it('increases difficulty if current block mined too fast', ()  => {
            expect(
                Block.adjustDifficulty({
                    lastBlock: { blockHeaders: { difficulty: 12, timestamp: Date.now() - 5 * 1000} },
                    timestamp: Date.now()
                })
            ).toEqual(13)
        })
    })

    describe('validateBlock()', () => {

        beforeEach(() => {
            lastBlock = Block.genesis()
            block = Block.mineBlock({lastBlock, beneficiary: 'beneficiary'})
        })

        it('resolves when the block is the genesis block', () => {
            expect(Block.validateBlock({ block: Block.genesis() })).resolves
        })

        it('resolves when the block valid', () => {
            expect(
               () => Block.validateBlock({
                        lastBlock,
                        block
                    })
            ).resolves
        })

        it('rejects when the parent hash is invalid', () => {
            block.blockHeaders.parentHash = 'foo'
            expect(
               () => Block.validateBlock({
                    lastBlock,
                    block
                }).rejects
            )
        })

        it('rejects when the block number increment invalid', () => {
            block.blockHeaders.number = 20
            expect(
                () => Block.validateBlock({
                     lastBlock,
                     block
                 }).rejects
             )
        })

        it('rejects when the block difficulty adjustment invalid', () => {
            block.blockHeaders.difficulty = 20
            expect(
                () => Block.validateBlock({
                     lastBlock,
                     block
                 }).rejects
             )
        })

        it('rejects when proof of work invalid', () => {
            const originalCalculateBlockTargetHash = Block.calculateBlockTargetHash

            Block.calculateBlockTargetHash = () => {
                return '0'.repeat(64)
            }

            expect(
                () => Block.validateBlock({
                    lastBlock,
                    block
                })
            ).rejects

            Block.calculateBlockTargetHash = originalCalculateBlockTargetHash
        })
    })
})