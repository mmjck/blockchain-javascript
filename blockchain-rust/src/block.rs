use super::*;

use std::time::SystemTime;

use bincode::serialize;
use crypto::{digest::Digest, sha2::Sha256};
use errors::Response;
use log::info;
use serde::{Deserialize, Serialize};
use transaction::Transaction;

#[derive(Debug, Clone, Serialize, Deserialize)]
pub struct Block {
    timestamp: u128,
    transactions: Vec<Transaction>,
    prev_block_hash: String,
    hash: String,
    height: usize,
    nonce: i32,
}


pub const TARGET_HEXS: usize = 4;

impl Block {
    pub fn get_hash(&self) -> String {
        self.hash.clone()
    }

    pub fn get_prev_hash(&self) -> String {
        self.prev_block_hash.clone()
    }

    pub fn get_transactions(&self) -> &Vec<Transaction> {
        &self.transactions
    }


    pub fn new_genesis_block(coinbase:Transaction) -> Block{
        Block::new_block(vec![coinbase], String::new(), 0).unwrap()
    }
    pub fn new_block(data: Vec<Transaction>, prev_block_hash: String, height: usize) -> Response<Block> {
        let timestamp = SystemTime::now()
            .duration_since(SystemTime::UNIX_EPOCH)?
            .as_millis();

        let mut block = Block {
            timestamp,
            transactions: data,
            prev_block_hash,
            hash: String::new(),
            height,
            nonce: 0,
        };

        block.run_proof_if_work()?;
        Ok(block)
    }

    fn run_proof_if_work(&mut self) -> Response<()> {
        info!("Mining the block");

        while !self.validate()? {
            self.nonce += 1;
        }

        let data = self.prepare_hash_data()?;
        let mut hasher = Sha256::new();

        hasher.input(&data[..]);
        self.hash = hasher.result_str();

        Ok(())
    }

    fn prepare_hash_data(&self) -> Response<Vec<u8>> {
        let content = (
            self.prev_block_hash.clone(),
            self.transactions.clone(),
            self.timestamp,
            TARGET_HEXS,
            self.nonce,
        );

        let bytes = serialize(&content)?;
        Ok(bytes)
    }

    fn validate(&self) -> Response<bool> {
        let data = self.prepare_hash_data()?;

        let mut hasher = Sha256::new();

        hasher.input(&data[..]);
        let mut vec1: Vec<u8> = Vec::new();
        vec1.resize(TARGET_HEXS, '0' as u8);
        Ok(&hasher.result_str()[0..TARGET_HEXS] == String::from_utf8(vec1)?)
    }
}





