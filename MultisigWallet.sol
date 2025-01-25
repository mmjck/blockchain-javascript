// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract MultisigWallet {
    address[] public owners;
    uint256 public requiredApprovals;
    address public campaignContract;
    

    struct Transaction {
        address recipient;
        uint256 value;
        bool executed;
        uint256 approvals;
        uint256 campaignId;
    }

    mapping(uint256 => Transaction) public transactions;
    mapping(uint256 => mapping(address => bool)) public aprovals;
    uint256 public transactionCount;

    modifier onlyOwner() {
        bool isOwner = false;
        for (uint256 i = 0; i < owners.length; i++) {
            if (owners[i] == msg.sender) {
                isOwner = true;
                break;
            }
        }

        require(isOwner, "Caller is not an owner");
        _;
    }

    constructor(address[] memory _owners, uint256 _requiredApprovals, address _campaignContract) {
        owners = _owners;
        requiredApprovals = _requiredApprovals;
        campaignContract = _campaignContract;
    }


    function proposeTransaction(
        address _recipient,
        uint256 _value,
        uint256 _campaignId
    ) external onlyOwner {

        transactionCount++;
        transactions[transactionCount] = Transaction({
                recipient: _recipient,
                value: _value,
                executed: false,
                approvals: 0,
                campaignId: _campaignId
        });
    }


    function approveTransaction(uint256 _txId) external onlyOwner{
        Transaction storage t = transactions[_txId];
        t.approvals++;
        aprovals[_txId][msg.sender] = true;
    }

    function executeTransaction(uint256 _txId) external onlyOwner {
        Transaction storage transaction = transactions[_txId];
        transaction.executed = true;
        
        (bool success, ) = campaignContract.call(
                abi.encodeWithSignature(
                        "releaseFunds(uint256,address,uint256)",
                        transaction.campaignId,
                        transaction.recipient,
                        transaction.value
                )
        );
        require(success, "Transaction execution failed");
    }
}
