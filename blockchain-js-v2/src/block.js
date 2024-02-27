const { debug } = require('console')
const SHA256 = require('crypto-js/sha256')

class Block {
    /**
    * @param {number} timestamp
    * @param {Transaction[]} transactions
    * @param {string} previousHash
    */
    constructor(timestamp, transactions, previousHash = "") {
        this.previousHash = previousHash
        this.timestamp = timestamp
        this.transactions = transactions
        this.nonce = 0
        this.hash = this.calculateHash()
    }


    calculateHash() {
        const value = this.previousHash     +
         this.timestamp                     + 
         JSON.stringify(this.transactions)  + 
         this.nonce


        return SHA256(value).toString()
    }

    mineBlock(difficulty) {
        while (
            this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")
        ) {
            this.nonce++
            this.hash = this.calculateHash()
        }
        debug(`Block mined: ${this.hash}`);
    }

    hasValidTransactions(){
        for (const tx of this.transactions) {
            if(!tx.isValid()){
                return false
            }
        }
        return true
    }

}
module.exports.Block = Block