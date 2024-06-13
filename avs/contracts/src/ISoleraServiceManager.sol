// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

interface ISoleraServiceManager {
    // EVENTS
    event SubmittedTask(uint256 srcChainId, uint256 dstChainId, address sender, address recipient, uint256 amount);

    // FUNCTIONS
    function submitTask(uint256 _srcChainId, uint256 _dstChainId, address _sender, address _recipient, uint256 _amount) external;
}