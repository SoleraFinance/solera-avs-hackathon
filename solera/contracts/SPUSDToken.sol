// SPDX-License-Identifier: MIT
pragma solidity 0.8.24;

import {ERC20} from "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import {ERC20Permit} from "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";

contract SPUSDToken is ERC20, ERC20Permit {
    // --- Errors ---
    error SPUSDCallerIsNotSoleraService();

    // --- Addresses ---
    address public immutable serviceAddress;

    constructor(address _serviceAddress)
        ERC20("spUSD Stablecoin", "spUSD")
        ERC20Permit("spUSDToken")
    {
        serviceAddress = _serviceAddress;
    }

    /**
     * @dev Creates `amount` new tokens for `to`.
     *
     * See {ERC20-_mint}.
     *
     * Requirements:
     *
     * - the caller must be the `serviceAddress`.
     */
    function mint(address to, uint256 amount) public {
        _requireCallerIsSoleraService();
        _mint(to, amount);
    }

    /**
     * @dev Destroys `amount` tokens from account.
     *
     * See {ERC20-_burn}.
     *
     * Requirements:
     *
     * - the caller must be the `serviceAddress`.
     */
    function burn(address account, uint256 amount) public {
        _requireCallerIsSoleraService();
        _burn(account, amount);
    }

    // --- 'require' functions ---

    function _requireCallerIsSoleraService() internal view {
        if (msg.sender != serviceAddress) {
            revert SPUSDCallerIsNotSoleraService();
        }
    }
}
