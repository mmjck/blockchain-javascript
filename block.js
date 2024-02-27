import sha256 from 'crypto-js/sha256';

class Block {
    constructor(index = 0, previousHash, data = 'Genesis block'){
        this.index = index
        this.previousHash = previousHash
        this.data = data
        this.timestamp = new Date()
        this.hash = this.generateHash() 
    }
    
    generateHash(){
        return sha256(this.index +
                this.previousHash + 
                JSON.stringify(this.dada) +
                this.timestamp).toString()
    }
}

export default Block