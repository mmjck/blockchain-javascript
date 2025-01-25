//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

contract LogicContractV1 {
    uint256 private _value;

    event ValueUpdated(address indexed updater, uint256 oldValue, uint256 newValue);


    function setValue(uint256 newValue) public {
        uint256 oldValue = _value;

        _value = newValue;
        emit ValueUpdated(msg.sender, oldValue, newValue);
    }

    function getValue() public view returns (uint256){
        return _value;
    }
}



contract ProxyTransparent {
    uint256 private _value;
    address private _implementation;
    address private _admin;


    constructor(address initialImpl){
        _admin = msg.sender;
        _implementation = initialImpl;

    }

    modifier onlyAdmin(){
            require(msg.sender == _admin, "Proxy: Caller is not the admin");
            _;
    }

    function upgrade(address newImpl) external  onlyAdmin {
        require(newImpl != address(0), "Invalid address");

        _implementation = newImpl;
    }

    function implementation() external  view onlyAdmin returns (address){
        return _implementation;
    }


    function getValue() external view returns (uint256){
        return _value;
    }

    fallback() external payable {
        (bool success, ) = _implementation.delegatecall(msg.data);
        require(success, "Delegate failed");
    }


    receive() external payable { }

}


contract LogicContractV2 {
    uint256 private _value;


    function setValue(uint256 newValue) public {
        _value = newValue * 2;
    }

    function getValue() public view returns (uint256){
        return _value;
    }
}