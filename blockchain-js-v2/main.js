const SHA256 =  require('crypto-js/sha256')

class Block{
    constructor(index, timestamp, data, previousHash = ""){
        this.index = index
        this.timestamp = timestamp
        this.data = data
        this.previousHash = previousHash
        this.hash = this.calculateHash()
        this.nonce = 0
    }


    calculateHash(){
        const value = this.index +
         this.previousHash + 
         this.timestamp + 
         JSON.stringify(this.data) +
         this.nonce


        return SHA256(value).toString()
    }

    mineHash(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++
            this.hash = this.calculateHash()
        }
        

        console.log("Blocked mined " + this.hash);
    }
    
}

class Blockchain {
    constructor(){
        this.chain = [this.createGenesisBlock()]
        this.difficulty = 2
    }

    createGenesisBlock(){
        return new Block(0, "01/01/2017", "Genesis block", "0")
    }

    getLatestBlock(){
        return this.chain[this.chain.length - 1]
    }

    addBlock(newBlock){
        newBlock.previousHash = this.getLatestBlock().hash;
        newBlock.mineHash(this.difficulty)        
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

console.log("Mining block 1...")
savjeeCoin.addBlock(new Block(1, "10/10/2020", {amount: 1}))

console.log("Mining block 2...")
savjeeCoin.addBlock(new Block(1, "11/10/2020", {amount: 2}))

