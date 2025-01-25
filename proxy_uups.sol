//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol";

contract LogicContractV1 is Initializable, UUPSUpgradeable, OwnableUpgradeable {
    uint256 private _value;

    event ValueUpdated(address indexed updater, uint256 oldValue, uint256 newValue);
    

    function initialize(address owner) public initializer {
        __Ownable_init(owner);
        __UUPSUpgradeable_init();
    }

    function setValue(uint256 newValue) public {
        uint256 oldValue = _value;
        _value = newValue;
        emit ValueUpdated(msg.sender, oldValue, newValue);
    }


    function getValue() public  view  returns (uint256){
        return _value;
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

}


contract LogicContractV2 is Initializable, UUPSUpgradeable, OwnableUpgradeable {
    uint256 private _value;

    event ValueUpdated(address indexed updater, uint256 oldValue, uint256 newValue);
    

    function initialize(address owner) public initializer {
        __Ownable_init(owner);
        __UUPSUpgradeable_init();
    }

    function setValue(uint256 newValue) public {
        uint256 oldValue = _value;
        _value = newValue * 2;
        emit ValueUpdated(msg.sender, oldValue, newValue);
    }


    function getValue() public  view  returns (uint256){
        return _value;
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

}


contract UUPSProxy {
    constructor(address logic, bytes memory data) payable  {
        new ERC1967Proxy(logic, data);
    }
}