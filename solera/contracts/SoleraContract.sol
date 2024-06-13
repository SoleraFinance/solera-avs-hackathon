// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.24;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract SoleraContract {
    // --- Events ---
    event NewLock(uint256 _destinationChainid, address _recipient, uint256 _amount);

    function lockCollateral(uint256 _destinationChainid, address _recipient) external payable {
        emit NewLock(_destinationChainid, _recipient, msg.value);
    }
}
