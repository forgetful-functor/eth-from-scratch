const Interpreter = require('./index');

const {
    STOP,
    ADD,
    PUSH, 
    SUB, 
    MUL, 
    DIV, 
    LT, 
    GT, 
    EQ, 
    AND, 
    OR, 
    JUMP, 
    JUMPI 
} = Interpreter.OPCODE_MAP

describe("Interpreter", () => {
    describe('runCode()', () => {
        describe('and the code includes ADD', () => {
            it('adds two values', () => {
                const program = [PUSH, 5, PUSH, 7, ADD, STOP]
                const result = new Interpreter().runCode(program)
                expect(result).toEqual(12)
            })
        })
    })
})