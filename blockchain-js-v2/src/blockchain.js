const { debug } = require('console')
const { Block } = require('./block')
const { Transaction } = require('./transaction')

class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()]
        this.difficulty = 2
        this.pendingTransaction = []
        this.miningReward = 100
    }

    createGenesisBlock() {
        return new Block(Date.parse("2024-01-01"), [], "0")
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1]
    }

    miningPendingTransactions(miningRewardAddress) {
        const rewartTx = new Transaction(
            null,
            miningRewardAddress,
            this.miningReward
        )
        this.pendingTransaction.push(rewartTx)

        const block = new Block(new Date(), this.pendingTransaction, this.getLatestBlock().hash)
        block.mineBlock(this.difficulty)

        debug("Block successfuly")
        this.chain.push(block)

        this.pendingTransaction = []
    }


    addTransaction(transaction) {
        if(!transaction.fromAddress || !transaction.toAddress){
            throw new Error("Transaction must include from and to address")
        }

        if(!transaction.isValid()){
            throw new Error("Cannot add invalid transaction to chain")
        }


        if(transaction.amount <= 0){
            throw new Error("Transaction amount should be higher than 0")
        }

        const walletBalance = this.getBalanceOfAddress(transaction.fromAddress)
        if(walletBalance < transaction.amount){
            throw new Error("Not enough balance")
        }

        const pendingTxForWallet = this.pendingTransaction.filter(
            (tx) => tx.fromAddress == transaction.fromAddress
        )

        if(pendingTxForWallet.length > 0){
            const totalPendingAmount = pendingTxForWallet.map((tx) => tx.amount)
            .reduce((prev, curr) => prev + curr);


            const totalAmount = totalPendingAmount + transaction.amount

            if(totalAmount > walletBalance){
                throw new Error('Pending transactions for this wallet is higher than its balance.')
            }
        }

        this.pendingTransaction.push(transaction)
        debug('transaction added: %s', transaction);

    }

    getBalanceOfAddress(address) {
        let balance = 0

        for (const block of this.chain) {
            for (const trans of block.transactions) {
                if (trans.fromAddress === address) {
                    balance -= trans.amount
                }

                if (trans.toAddress === address) {
                    balance += trans.amount
                }
            }
        }
        debug('getBalanceOfAdrees: %s', balance);
        return balance
    }

    getAllTransactionsForWallet(address){
        const currentTransactions = []

        for (const block of this.chain) {
            for(const tx of block.transactions){
                if(tx.fromAddress ===  address || tx.toAddress === address){
                    txs.push(currentTransactions)
                }
            }
        }
        debug('get transactions for wallet count: %s', currentTransactions.length);
        return currentTransactions;
    }

    isChainValid() {
        const realGenesis = JSON.stringify(this.createGenesisBlock())

        if(realGenesis !== JSON.stringify(this.chain[0])){
            return false
        }

        for (let i = 1; i < this.chain.length; i++) {
            const currentBlock = this.chain[i]
            const previousBlock = this.chain[i - 1]

            if (previousBlock.hash !== currentBlock.previousHash) {
                console.log("1");
                console.log(previousBlock.hash);
                console.log(currentBlock.previousHash);
                console.log("1");

                return false
            }
            
            if(!currentBlock.hasValidTransactions()){
                console.log("2");
                return false
            }

            if (currentBlock.hash != currentBlock.calculateHash()){
                console.log("3");
                return false
            }
        }
        return true
    }
}

module.exports.Blockchain = Blockchain