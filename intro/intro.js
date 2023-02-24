const STOP  = 'STOP'
const ADD   = 'ADD'
const PUSH  = 'PUSH'

const program = ['PUSH', 2, 'PUSH', 3, 'ADD', 'STOP']

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
                        const first = this.state.stack.pop()
                        const second = this.state.stack.pop()
                        this.state.stack.push(first + second)
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

const interpreter = new Interpreter()

console.log(interpreter.runCode(program))