use std::collections::HashMap;

use clap::builder::Str;
use log::info;
use sled::transaction;

use crate::block::Block;
use crate::transaction::TXOutput;
use crate::{errors::Response, transaction::Transaction};

const TARGET_HEXT: usize = 4;

use serde::{Deserialize, Serialize};

const GENESIS_COINBASE_DATA: &str =
    "The Times 07/Jul/20024 Chancellor on brink of second bailout for banks";

#[derive(Debug, Clone)]
pub struct Blockchain {
    current_hash: String,
    db: sled::Db,
}

pub struct BlockchainIter<'a> {
    current_hash: String,
    bc: &'a Blockchain,
}

impl Blockchain {
    pub fn new() -> Response<Blockchain> {
        info!("open blockchain");

        let db = sled::open("data/blocks")?;
        let hash = db
            .get("LAST")?
            .expect("must create a new block database first");

        info!("Found block database");

        let last_hash = String::from_utf8(hash.to_vec())?;

        Ok(Blockchain {
            current_hash: last_hash,
            db,
        })
    }

    pub fn create_blockchain(address: String) -> Response<Blockchain> {
        info!("open blockchain");

        let db = sled::open("data/blocks")?;
        info!("creating new block database");

        let cbtx = Transaction::new_coinbase(address, String::from(GENESIS_COINBASE_DATA))?;
        let genesis = Block::new_genesis_block(cbtx);

        db.insert(genesis.get_hash(), bincode::serialize(&genesis)?)?;
        db.insert("LAST", genesis.get_hash().as_bytes())?;

        let bc = Blockchain {
            current_hash: genesis.get_hash(),
            db,
        };

        bc.db.flush();
        Ok(bc)
    }

    pub fn add_block(&mut self, transactions: Vec<Transaction>) -> Response<()> {
        let last_hash = self.db.get("LAST")?.unwrap();

        let new_block =
            Block::new_block(transactions, String::from_utf8(last_hash.to_vec())?, TARGET_HEXT)?;
        self.db
            .insert(new_block.get_hash(), bincode::serialize(&new_block)?)?;
        self.db.insert("LAST", new_block.get_hash().as_bytes())?;

        self.current_hash = new_block.get_hash();
        Ok(())
    }

    pub fn iter(&self) -> BlockchainIter {
        BlockchainIter {
            current_hash: self.current_hash.clone(),
            bc: &self,
        }
    }


    pub fn find_UTXO(&self, address: &str) -> Vec<TXOutput> {
        let mut utxos = Vec::<TXOutput>::new();
        let unspend_TXs = self.find_unspent_transactions(address);

        for tx in unspend_TXs {
            for out in &tx.vout {
                if out.can_be_unlock_with(&address){
                    utxos.push(out.clone());
                }
            };
        }

        utxos
    }


    pub fn find_spendable_outputs(
        &self, address: &str, amount: i32
    ) -> (i32, HashMap<String, Vec<i32>>) {
        let mut unspent_outputs: HashMap<String, Vec<i32>> = HashMap::new();

        let mut accumulated = 0;
        let mut unspend_TXs = self.find_unspent_transactions(address);

        for tx in unspend_TXs {
            for index in 0..tx.vout.len() {
                if tx.vout[index].can_be_unlock_with(address) && accumulated < amount {
                    match  unspent_outputs.get_mut(&tx.id) {
                        Some(v) => v.push(index as i32),
                        None => {
                            unspend_TXs.insert(tx.id.clone(), vec![index as i32])
                        }
                    }
                }

                accumulated += tx.vout[index].value;

                if accumulated >= amount {
                    return (accumulated, unspent_outputs);
                }
            };
        }
        (accumulated, unspent_outputs)
    }



    fn find_unspent_transactions(&self, address: &str) -> Vec<Transaction>{
        let mut spent_TXOs:HashMap<String, Vec<i32>> = HashMap::new();
        
        let mut unspend_TXs = Vec::new();

        for block in self.iter() {
            for tx in block.get_transactions()  {
                for index in 0..tx.vout.len(){
                    if let Some(ids) = spent_TXOs.get(&tx.id){
                        if ids.contains(&(index as i32)) {
                            continue;
                        }
                    }

                    if tx.vout[index].can_be_unlock_with(address){
                        unspend_TXs.push(tx.to_owned())
                    }
                }


                if !tx.is_coinbase() {
                    for i in &tx.vin {
                        if i.can_unlock_output_with(address){
                            match spent_TXOs.get_mut(&i.txid) {
                                Some(v) => {
                                    v.push(i.vout);
                                }
                                None => {
                                    spent_TXOs.insert(i.txid.clone(), vec![i.vout]);
                                }
                            }
                        }
                    }
                }
            }
        }

        unspend_TXs
    }
}

impl<'a> Iterator for BlockchainIter<'a> {
    type Item = Block;

    fn next(&mut self) -> Option<Self::Item> {
        if let Ok(enconded_block) = self.bc.db.get(&self.current_hash) {
            return match enconded_block {
                Some(b) => {
                    if let Ok(block) = bincode::deserialize::<Block>(&b) {
                        self.current_hash = block.get_prev_hash();
                        Some(block)
                    } else {
                        None
                    }
                }
                None => None,
            };
        };

        None
    }
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_add_block() {
        
    }
}
