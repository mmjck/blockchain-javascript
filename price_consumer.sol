//SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@chainlink/contracts/src/v0.8/interfaces/AggregatorV3Interface.sol";


contract PriceConsumerV3 {
    AggregatorV3Interface internal priceFeed;
     
    constructor(){
        priceFeed = AggregatorV3Interface(0xe7656e23fE8077D438aEfbec2fAbDf2D8e070C4f);
    }

    function getLatestPrice() public view returns(int256) {
        (, int256 price, , , ) = priceFeed.latestRoundData();
        return price;
    }

}