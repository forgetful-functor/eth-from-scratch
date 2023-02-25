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

const FALSE = 0
const TRUE  = 1

describe("Interpreter", () => {
    describe('runCode()', () => {
        describe('the program includes arithmetic opcodes', () => {
            it('adds two values', () => {
                const program = [PUSH, 5, PUSH, 7, ADD, STOP]
                const result = new Interpreter().runCode(program)
                expect(result).toEqual(12)
            })

            it('substracts two values', () => {
                const program = [PUSH, 7, PUSH, 5, SUB, STOP]
                const result = new Interpreter().runCode(program)
                expect(result).toEqual(-2)
            })

            it('multiplies two values', () => {
                const program = [PUSH, 7, PUSH, 5, MUL, STOP]
                const result = new Interpreter().runCode(program)
                expect(result).toEqual(35)
            })

            it('divides two values', () => {
                const program = [PUSH, 5, PUSH, 15, DIV, STOP]
                const result = new Interpreter().runCode(program)
                expect(result).toEqual(3)
            })
        })

        describe("the program includes comparison opcode", () => {
            it('GT - result is false', () => {
                const program = [PUSH, 12, PUSH, 3, GT, STOP]
                const result = new Interpreter().runCode(program)
                expect(result).toEqual(FALSE)
            })

            it('GT - result is true', () => {
                const program = [PUSH, 3, PUSH, 12, GT, STOP]
                const result = new Interpreter().runCode(program)
                expect(result).toEqual(TRUE)
            })
            
            it('LT - result is false', () => {
                const program = [PUSH, 3, PUSH, 12, LT, STOP]
                const result = new Interpreter().runCode(program)
                expect(result).toEqual(FALSE)
            })

            it('LT - result is true', () => {
                const program = [PUSH, 12, PUSH, 3, LT, STOP]
                const result = new Interpreter().runCode(program)
                expect(result).toEqual(TRUE)
            })

            it('EQ - result is true', () => {
                const program = [PUSH, 3, PUSH, 3, EQ, STOP]
                const result = new Interpreter().runCode(program)
                expect(result).toEqual(TRUE)
            })

            it('EQ - result is false', () => {
                const program = [PUSH, 3, PUSH, 4, EQ, STOP]
                const result = new Interpreter().runCode(program)
                expect(result).toEqual(FALSE)
            })

            it('OR - result is true', () => {
                const program = [PUSH, 0, PUSH, 1, OR, STOP]
                const result = new Interpreter().runCode(program)
                expect(result).toEqual(TRUE)
            })

            it('OR - result is false', () => {
                const program = [PUSH, 0, PUSH, 0, OR, STOP]
                const result = new Interpreter().runCode(program)
                expect(result).toEqual(FALSE)
            })

            it('AND - result is true', () => {
                const program = [PUSH, 1, PUSH, 1, AND, STOP]
                const result = new Interpreter().runCode(program)
                expect(result).toEqual(TRUE)
            })

            it('AND - result is false', () => {
                const program = [PUSH, 0, PUSH, 1, AND, STOP]
                const result = new Interpreter().runCode(program)
                expect(result).toEqual(FALSE)
            })
        })

        describe("the program includes jump opcode", () => {
            it("jumps correctly - JUMP", () => {
                const program = [PUSH, 3, JUMP, PUSH, 3, PUSH, 4, ADD, STOP]
                const result  = new Interpreter().runCode(program)

                expect(result).toEqual(7)
            })

            it("jumps correctly - JUMPI", () => {
                const program = [PUSH, 3, PUSH, 1, JUMPI, PUSH, 3, PUSH, 4, ADD, STOP]
                const result  = new Interpreter().runCode(program)

                expect(result).toEqual(7)
            })
        })

        describe('the program throws', () => {
            it('when JUMP to an ilegal destination', () => {
                const program = [PUSH, 99, JUMP, PUSH, 0, JUMP, PUSH, 'jump succesfull', STOP]
                expect(
                   () => new Interpreter().runCode(program)
                ).toThrow('Invalid destination: 99')
            })

            it('when invalid PUSH value', () => {
                const program = [PUSH, 0, PUSH]
                expect(
                   () => new Interpreter().runCode(program)
                ).toThrow('Push instruction cannot be last')
            })

            it('when program executes infinitely', () => {
                const program = [PUSH, 0, JUMP, STOP]
                expect(
                   () => new Interpreter().runCode(program)
                ).toThrow('Check for infinite loop. Execution limit of 10000 has been exceeded')
            })
        })
    })
})