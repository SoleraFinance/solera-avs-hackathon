// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@eigenlayer/contracts/core/DelegationManager.sol";
import "@eigenlayer-middleware/src/unaudited/ECDSAServiceManagerBase.sol";
import "@eigenlayer-middleware/src/unaudited/ECDSAStakeRegistry.sol";
import "@eigenlayer/contracts/permissions/Pausable.sol";
import {IRegistryCoordinator} from "@eigenlayer-middleware/src/interfaces/IRegistryCoordinator.sol";
import "./ISoleraServiceManager.sol";

/**
 * @title Primary entrypoint for procuring services from SoleraService.
 * @author Eigen Labs, Inc.
 */
contract SoleraServiceManager is 
    ECDSAServiceManagerBase,
    ISoleraServiceManager,
    Pausable
{
    /* MODIFIERS */
    modifier onlyOperator() {
        require(
            ECDSAStakeRegistry(stakeRegistry).operatorRegistered(msg.sender) 
            == 
            true, 
            "Operator must be the caller"
        );
        _;
    }

    constructor(
        address _avsDirectory,
        address _stakeRegistry,
        address _delegationManager
    )
        ECDSAServiceManagerBase(
            _avsDirectory,
            _stakeRegistry,
            address(0), // doesn't need to deal with payments
            _delegationManager
        )
    {}

    /* FUNCTIONS */

    function submitTask(
        uint256 _srcChainId, 
        uint256 _dstChainId, 
        address _sender, 
        address _recipient, 
        uint256 _amount
    ) override external onlyOperator {
        require(
            operatorHasMinimumWeight(msg.sender),
            "Operator does not have match the weight requirements"
        );

        emit SubmittedTask(_srcChainId, _dstChainId, _sender, _recipient, _amount);
    }

    // HELPER

    function operatorHasMinimumWeight(address operator) public view returns (bool) {
        return ECDSAStakeRegistry(stakeRegistry).getOperatorWeight(operator) >= ECDSAStakeRegistry(stakeRegistry).minimumWeight();
    }
}