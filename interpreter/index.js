const STOP  = 'STOP'
const ADD   = 'ADD'
const PUSH  = 'PUSH'
const SUB   = 'SUB'
const MUL   = 'MUL'
const DIV   = 'DIV'

class Interpreter {
    constructor() {
        this.state = {
            programCounter: 0,
            stack: [],
            code: []
        }
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
                        const a = this.state.stack.pop()
                        const b = this.state.stack.pop()
                        let result;
                        
                        if(opCode === ADD) result = a + b
                        if(opCode === SUB) result = a - b
                        if(opCode === MUL) result = a * b
                        if(opCode === DIV) result = a / b

                        this.state.stack.push(result)
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

const logProgramResult = (p) => {
    console.log(new Interpreter().runCode(p))
}

const program = [PUSH, 2, PUSH, 3, ADD, PUSH, 5, MUL, STOP]

logProgramResult(program) //25

const program2 = [PUSH, 22, PUSH, 11, DIV, PUSH, 5, MUL, PUSH, 13, SUB, STOP]

logProgramResult(program2) //3