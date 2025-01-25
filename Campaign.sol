// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Campaign {
    struct CampaignDetails {
        address creator;
        string title;
        string description;
        uint256 goal;
        uint256 totalContributed;
        bool completed;
    }

    mapping(uint256 => CampaignDetails) public campaigns;
    uint256 public campaignCount;
    address public multisigWallet;
    
    modifier onlyMultisig(){
        require (msg.sender == multisigWallet, "Caller is not the multisig wallet");
        _;
    }

    function setMultisigWallet(address _multisigWallet) external {
        multisigWallet = _multisigWallet;
    }

    function createCampaign(string memory _title, string memory _description, uint256 _goal) external{
        campaignCount++;

        campaigns[campaignCount] = CampaignDetails({
            creator: msg.sender,
            title: _title,
            description: _description,
            goal: _goal,
            totalContributed: 0,
            completed: false
        });
        
    }
    
    
    function contribte(uint256 _campaignId) external payable {
        CampaignDetails storage c = campaigns[_campaignId];
        c.totalContributed += msg.value;
    }

    function releaseFunds(uint256 _campaignId, address _to, uint256 _amount) external  onlyMultisig {
        CampaignDetails storage c = campaigns[_campaignId];
        c.totalContributed -= _amount;
        c.completed = c.totalContributed == 0;

        (bool success, ) = _to.call{value: _amount}("");
        require(success, "Transfer failed");
    }
}