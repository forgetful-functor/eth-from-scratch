const STOP  = 'STOP'
const ADD   = 'ADD'
const PUSH  = 'PUSH'

const SUB   = 'SUB'
const MUL   = 'MUL'
const DIV   = 'DIV'

const LT    = 'LT'
const GT    = 'GT'
const EQ    = 'EQ'
const AND   = 'AND'
const OR    = 'OR'

const JUMP  = 'JUMP'
const JUMPI = 'JUMPI'

class Interpreter {
    constructor() {
        this.state = {
            programCounter: 0,
            stack: [],
            code: []
        }
    }

    jump() {
        const destination = this.state.stack.pop()
        this.state.programCounter = destination
        this.state.programCounter--
    }

    runCode(code) {
        try{
            this.state.code = code;

            while(this.state.programCounter < this.state.code.length) {
                const opCode = this.state.code[this.state.programCounter];

                switch(opCode) {
                    case STOP:
                        throw new Error("Program finished")
                    case PUSH:
                        this.state.programCounter++;
                        this.state.stack.push(this.state.code[this.state.programCounter])
                        break
                    case ADD:
                    case SUB:
                    case MUL:
                    case DIV:
                    case LT:
                    case GT:
                    case EQ:
                    case AND:
                    case OR:
                        const a = this.state.stack.pop()
                        const b = this.state.stack.pop()
                        let result;
                        
                        if(opCode === ADD) result = a + b
                        if(opCode === SUB) result = a - b
                        if(opCode === MUL) result = a * b
                        if(opCode === DIV) result = a / b
                        if(opCode === LT)  result = a < b   ? 1 : 0 
                        if(opCode === GT)  result = a > b   ? 1 : 0
                        if(opCode === EQ)  result = a === b ? 1 : 0
                        if(opCode === AND) result = a && b
                        if(opCode === OR)  result = a || b

                        this.state.stack.push(result)
                        break
                    case JUMP:
                        this.jump()
                        break
                    case JUMPI:
                        const condition = this.state.stack.pop()
                        if(condition === 1) {
                            this.jump()
                        }
                        break
                    default:
                        break;
                }

                this.state.programCounter++;
            }
        } catch(err) {
            return this.state.stack[this.state.stack.length - 1]
        }
    }

    
}

const logProgramResult = (p, msg) => {
    console.log(`${msg} = ${new Interpreter().runCode(p)}`)
}

const program = [PUSH, 2, PUSH, 3, ADD, PUSH, 5, MUL, STOP]
logProgramResult(program, "5 * (3 + 2)") //25

const program2 = [PUSH, 22, PUSH, 11, DIV, PUSH, 5, MUL, PUSH, 13, SUB, STOP]
logProgramResult(program2, "13 - (5 * (11/22))") //10.5

const program3 = [PUSH, 4, PUSH, 5, LT, STOP]
logProgramResult(program3, "5 < 4") //0 = false

const program4 = [PUSH, 4, PUSH, 5, GT, STOP]
logProgramResult(program4, "5 > 4") //1 = true

const program5 = [PUSH, 5, PUSH, 5, EQ, STOP]
logProgramResult(program5, "5 == 5") //1 = true

const program6 = [PUSH, 1, PUSH, 0, OR, STOP]
logProgramResult(program6, "1 && 0")

const program7 = [PUSH, 1, PUSH, 0, AND, STOP]
logProgramResult(program7, "1 || 0")

const program8 = [PUSH, 6, JUMP, PUSH,0, JUMP, PUSH, 'jump succesful', STOP]
logProgramResult(program8, "Result of jump")

const program9 = [PUSH, 8, PUSH, 1, JUMPI, PUSH,0, JUMP, PUSH, 'jump succesful', STOP]
logProgramResult(program9, "Result of jumpi")
