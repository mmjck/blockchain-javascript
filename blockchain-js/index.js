import Blockchain from './blockchain.js';


const blockchain = new Blockchain()

blockchain.addBlock({amount: 4})
blockchain.addBlock({amount: 5})

console.log(blockchain);


console.log(blockchain)

console.log(blockchain.isValid())
blockchain.blocks[1].data.amount = 30000
console.log(blockchain.isValid())