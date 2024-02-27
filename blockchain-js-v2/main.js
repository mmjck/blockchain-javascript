const SHA256 =  require('crypto-js/sha256')

class Block{
    constructor(index, timestamp, data, previousHash = ""){
        this.index = index
        this.timestamp = timestamp
        this.data = data
        this.previousHash = previousHash
        this.hash = this.calculateHash()
    }


    calculateHash(){
        const value = this.index + this.previousHash + this.timestamp + JSON.stringify(this.data)
        return SHA256(value).toString()
    }
    
}

class Blockchain {
    constructor(){
        this.chain = [this.createGenesisBlock()]
    }

    createGenesisBlock(){
        return new Block(0, "01/01/2017", "Genesis block", "0")
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1]
    }

    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.hash = newBlock.calculateHash()
        
        this.chain.push(newBlock)
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

savjeeCoin.addBlock(new Block(1, "10/10/2020", {amount: 1}))
savjeeCoin.addBlock(new Block(1, "11/10/2020", {amount: 2}))

console.log(JSON.stringify(savjeeCoin, null, 4))

console.log("Is blockchain valid? " + savjeeCoin.isChainValid())

//savjeeCoin.chain[1].data = { amount: 10 }
savjeeCoin.chain[1].data = savjeeCoin.chain[1].calculateHash()

console.log("Is blockchain valid? " + savjeeCoin.isChainValid())
