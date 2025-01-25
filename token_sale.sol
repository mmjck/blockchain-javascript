pragma solidity ^0.8.7;


contract TokenSake is Ownable {
    IERC20 public token;

    event TokensPurchased(address indexed buyer, uint256 amountSpent, uint256 tokensBought);

    constructor(
        address _tokenAddress
    ){
        token = IERC20(_tokenAddress);
    }

    function buyTokens() external payable {
        uint256 tokensToBuy = ethAmountInUsd * tokensPerUsd;
        token.transfer(msg.sender, tokensToBuy)
        emit TokensPurchased(msg.sender, msg.value, tokensToBuy);
    }
}
