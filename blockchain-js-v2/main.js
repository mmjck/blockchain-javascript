const SHA256 =  require('crypto-js/sha256')

class Transaction {
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress
        this.toAddress = toAddress
        this.amount = amount
    }
}



class Block{
    constructor(timestamp, transactions, previousHash = ""){
        this.previousHash = previousHash
        this.timestamp = timestamp
        this.transactions = transactions
        this.hash = this.calculateHash()
        this.nonce = 0
    }


    calculateHash(){
        const value =  this.previousHash + this.timestamp + JSON.stringify(this.transactions) + this.nonce
        return SHA256(value).toString()
    }

    mineHash(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++
            this.hash = this.calculateHash()
        }
        console.log("BLOCKED MINED " + this.hash);
    }
    
}

class Blockchain {
    constructor(){
        this.chain = [this.createGenesisBlock()]
        this.difficulty = 2
        this.pendingTransaction = []
        this.miningReward = 100
    }

    createGenesisBlock(){
        return new Block("01/01/2024", "GENESIS BLOCK", "0")
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1]
    }

    miningPendingTransactions(miningRewardAddress){
        let block = new Block(new Date(), this.pendingTransaction)
        block.mineHash(this.difficulty)

        console.log("BLOCK SUCCESSFULY")
        this.chain.push(block)

        this.pendingTransaction = [
            new Transaction(null, miningRewardAddress, this.miningReward),
        ]
    }


    createTransaction(transaction){
        this.pendingTransaction.push(transaction)
    }

    getBalanceOfAddress(address){
        let balance = 0

        for(const block of this.chain){
            for(const trans of block.transactions){
                if(trans.fromAddress === address){
                    balance -= trans.amount
                }

                if(trans.toAddress === address){
                    balance += trans.amount
                }
            }
        }

        return balance
    }

    isChainValid(){
        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i]
            const previousBlock = this.chain[i - 1]

            if(currentBlock.hash != currentBlock.calculateHash()){
                return false
            }

            if(currentBlock.previousHash != previousBlock.hash){
                return false
            }
        }
        return true
    }

}


let savjeeCoin = new Blockchain()
savjeeCoin.createTransaction(new Transaction("address1", "address2", 90))
savjeeCoin.createTransaction(new Transaction("address2", "address1", 20))


console.log("Starting the miner ...")
savjeeCoin.miningPendingTransactions("xdieck-address")

console.log(savjeeCoin.getBalanceOfAddress("xdieck-address"))

console.log("Starting the miner again ...")
savjeeCoin.miningPendingTransactions("xdieck-address")


console.log(savjeeCoin.getBalanceOfAddress("xdieck-address"))

