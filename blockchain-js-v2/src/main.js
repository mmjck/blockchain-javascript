const { Blockchain } = require('./blockchain')
const { Transaction } = require('./transaction')

const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const myKey = ec.keyFromPrivate('c0c31dd26fe8570e4074c8f701a19db7beb21e6f535719a24852264b04709c93')
const myWalletAddress = myKey.getPublic('hex')

const savjeeCoin = new Blockchain();

savjeeCoin.miningPendingTransactions(myWalletAddress)
const tx1 = new Transaction(myWalletAddress, "address2", 100)
tx1.sign(myKey)
savjeeCoin.addTransaction(tx1)


savjeeCoin.miningPendingTransactions(myWalletAddress)


const tx2 = new Transaction(myWalletAddress, "address1", 50)
tx2.sign(myKey)
savjeeCoin.addTransaction(tx2)


savjeeCoin.miningPendingTransactions(myWalletAddress)

console.log();
console.log(
  `Balance of my wallet is ${savjeeCoin.getBalanceOfAddress(myWalletAddress)}`
);

// Check if the chain is valid
console.log();
console.log('Blockchain valid?', savjeeCoin.isChainValid() ? 'Yes' : 'No');
