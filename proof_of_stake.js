const crypto = require("node:crypto")

class Validator {
    constructor(
        name, stake
    ) {
        this.name = name
        this.stake = stake
    }
}

class Block {
    constructor(
        index,
        timestamp,
        data,
        prevHash,
        validator
    ) {
        this.index = index
        this.timestamp = timestamp
        this.data = data
        this.prevHash = prevHash
        this.nonce = 0
        this.Validator = validator
    }


    calculateHash() {
        return crypto
            .createHash('sha256')
            .update(
                this.index +
                this.timestamp +
                this.prevHash +
                JSON.stringify(this.data) +
                this.validator
            ).digest("hex")
    }
}

class Blockchain {
    constructor(
        validators
    ) {
        this.chain = [this.createGenesis()]
        this.validators = validators;
    }

    createGenesis() {
        return new Block(0, new Date().toISOString(), "Block Genesis", '0', { name: "system" })
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1]
    }

    selectValidator() {
        const total = this.validators.reduce(
            (sum, val) => sum + val.stake, 0
        );

        let random = Math.random() * total

        for (const validator of this.validators) {
            if (random < validator.stake) {
                return validator
            }

            random -= validator.stake;
        }
    }


    addBlock(data) {
        const selectValidator = this.selectValidator()

        const pB = this.getLatestBlock()
        const b = new Block(
            this.chain.length,
            new Date().toISOString(),
            data,
            pB.hash,
            selectValidator
        );

        this.chain.push(b)
        console.log(`✅ Bloco ${b.index} validado por: ${selectValidator.name}`);

    }


    isValid() {
        for (let i = 1; i < this.chain.length; i++) {
            const pB = this.chain[i - 1]
            const b = this.chain[i]

            if (pB.hash !== b.calculateHash()) {
                return false
            }

            if (b.prevHash !== pB.hash) {
                return false
            }
        }

        return true
    }
}

const validators = [
    new Validator("Alice", 50),
    new Validator("Bod", 50),
    new Validator("Maria", 50),
]

const newBlockchain = new Blockchain(validators)
console.log("Criando blockchain");

newBlockchain.addBlock({ transactions: ["1 BTC"] })
newBlockchain.addBlock({ transactions: ["2 BTC"] })
newBlockchain.addBlock({ transactions: ["3 BTC"] })
