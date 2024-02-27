const SHA256 = require('crypto-js/sha256')
const EC = require('elliptic').ec;
const ec = new EC('secp256k1');

class Transaction {
    /**
    * @param {string} fromAddress
    * @param {string} toAddress
    * @param {number} amount
    */
    constructor(fromAddress, toAddress, amount) {
        this.fromAddress = fromAddress
        this.toAddress = toAddress
        this.amount = amount
        this.timestamp = Date.now()
    }
    
    /**
    * Creates a SHA256 hash of the transaction
    *
    * @returns {string}
    */
    calculateHash() {
        const value = this.fromAddress + this.toAddress + this.amount + this.timestamp
        return SHA256(value).toString()
    }

    sign(signinKey) {
        if (signinKey.getPublic('hex') !== this.fromAddress) {
            throw new Error("You cannot sign transactins for other wallets")
        }

        const hashTx = this.calculateHash()
        const sig = signinKey.sign(hashTx, 'base64')
        this.signature = sig.toDER('hex')
    }

    isValid() {
        if (this.fromAddress === null) return true
        
        if (!this.signature || this.signature.length === 0) {
            throw new Error("No signature in this transaction")
        }

        const publicKey = ec.keyFromPublic(this.fromAddress, 'hex')

        return publicKey.verify(this.calculateHash(), this.signature)
    }
}

module.exports.Transaction = Transaction