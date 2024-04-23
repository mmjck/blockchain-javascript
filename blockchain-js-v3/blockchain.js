const crypto = require("crypto");

class Blockchain {
    constructor(){
        this.chain = []
        this.pendingTransactions = [];
        this.peers = new Set()
        this.newBlock()
    }


    /**
     * Adds a node to our peer table
     */
    addPeer(host) {
        this.peers.push(host)
    }

    getPeers() {
        return Array.from(this.peers);
    }


    newBlock(previousHash, nonce = null){
        let block = { 
            index: this.chain.length,
            timestamp: new Date().toISOString(),
            transactions: this.pendingTransactions,
            previousHash,
            nonce
        }

        block.hash  = Blockchain.hash(block)

        console.log("Created block ", block.index);
        this.chain.push(block)
        this.pendingTransactions = []
    }

    /**
     * Generates a SHA-256 hash of the block
     */
    static hash(block){
        const blockString = JSON.stringify(block, Object.keys(block).sort())
        return crypto.createHash("sha256").update(blockString).digest("hex")
    }

    /**
     * Returns the last block in the chain
     */
    lastBlock(){
        return this.chain.length && this.chain[this.chain.length -1]
    }


    /**
     * Generates a random 32 byte string
     */
    static nonce(){
        return crypto.createHash("sha256").update(crypto.randomBytes(32)).digest("hex")
    }


    /**
     * Determines if a hash begins with a "difficulty" number of 0s
     *
     * @param hashOfBlock: the hash of the block (hex string)
     * @param difficulty: an integer defining the difficulty
     */
    static powIsAcceptable(hashOfBlock, difficulty){
        return hashOfBlock.slice(0, difficulty) === "0".repeat(difficulty)
    }


     /**
     * Proof of Work mining algorithm
     *
     * We hash the block with random string until the hash begins with
     * a "difficulty" number of 0s.
     */
    mine(blockToMine = null, difficulty = 4) {
        const block = blockToMine || this.lastBlock()

        while(true){
            block.nonce = Blockchain.nonce()

            if(this.powIsAcceptable(Blockchain.hash(block.hash), difficulty)){
                console.log("We mined a block!")
                console.log(` - Block hash: ${Blockchain.hash(block)}`);
                console.log(` - nonce:      ${block.nonce}`);
                return block;
            }
        }
    }
}


module.exports = Blockchain