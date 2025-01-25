const crypto = require("node:crypto")

class Block {
    constructor(
        index,
        timestamp,
        data,
        prevHash,
        diff
    ) {
        this.index = index
        this.timestamp = timestamp
        this.data = data
        this.prevHash = prevHash
        this.hash = ""
        this.nonce = 0
        this.diff = diff
    }


    calculateHash() {
        return crypto
            .createHash('sha256')
            .update(
                this.index +
                this.timestamp +
                this.prevHash +
                JSON.stringify(this.data) +
                this.nonce
            ).digest("hex")
    }

    mineBlock() {
        const st = Date.now()
        const prefix = '0'.repeat(this.diff)
        while (!this.hash.startsWith(prefix)) {
            this.nonce++
            this.hash = this.calculateHash()
        }

        const et = Date.now()
        console.log(`Block ${this.index} minerado: ${this.hash}`);
        console.log(`Tempo de mineração ${(et - st) / 1000} segundos`);

    }
}

class Blockchain {
    constructor(
        diff = 4
    ) {
        this.chain = [this.createGenesis()]
        this.diff = diff
    }

    createGenesis() {
        return new Block(0, new Date().toISOString(), "Block Genesis", '0', this.diff)
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1]
    }

    addBlock(data) {
        const pB = this.getLatestBlock()


        const b = new Block(this.chain.length, new Date().toISOString(), data, pB.hash, this.diff)
        b.mineBlock()

        this.chain.push(b)
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

const newBlockchain = new Blockchain(6)
console.log("Criando blockchain");

newBlockchain.addBlock({ transactions: ["1 BTC"] })
newBlockchain.addBlock({ transactions: ["2 BTC"] })
newBlockchain.addBlock({ transactions: ["3 BTC"] })
