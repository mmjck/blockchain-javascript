const { Blockchain } = require('./blockchain')
const { Transaction } = require('./transaction')

const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

const myKey = ec.keyFromPrivate('c0c31dd26fe8570e4074c8f701a19db7beb21e6f535719a24852264b04709c93')
const myWalletAddress = myKey.getPublic('hex')

let savjeeCoin = new Blockchain()

const tx1 = new Transaction(myWalletAddress, "public key goes here", 10)
tx1.signTransaction(myKey)

savjeeCoin.addTransaction(tx1)

console.log("Starting the miner ...")
savjeeCoin.miningPendingTransactions(myWalletAddress)

console.log(savjeeCoin.getBalanceOfAddress("xdieck-address"))


console.log("Is chain valid? ", savjeeCoin.isChainValid())