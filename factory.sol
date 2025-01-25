// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;


contract  BaseContract {
    address public creator;
    uint256 public initialValue;

     constructor(address _creator, uint256 _initialValue) {
        creator = _creator;
        initialValue = _initialValue;
    }
}


contract FactoryContract {
    address[] public deployedContracts;

    function createContract(uint256 _initialValue) external  {
        BaseContract bC = new BaseContract(msg.sender, _initialValue);
        deployedContracts.push(address(bC));
    }


    function getDeployedContracts() external view returns (address[] memory){

    }
}