// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";  
import "@openzeppelin/contracts/access/AccessControl.sol";

contract CampusCredit is ERC20, ERC20Burnable, ERC20Capped, Pausable, AccessControl {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    bytes32 public constant PAUSER_ROLE = keccak256("PAUSER_ROLE");

    /// Custom error for mismatched array lengths in airdrop
    error ArrayLengthMismatch();

    constructor(
        string memory name_,
        string memory symbol_,
        uint256 cap_,
        address initialReceiver,
        uint256 initialMint
    )
        ERC20(name_, symbol_)
        ERC20Capped(cap_)
    {
        // Assign roles to deployer
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
        _grantRole(PAUSER_ROLE, msg.sender);

        // Mint initial supply to the receiver
        _mint(initialReceiver, initialMint);
    }

    // Pause token transfers
    function pause() public onlyRole(PAUSER_ROLE) {
        _pause();
    }

    // Unpause token transfers
    function unpause() public onlyRole(PAUSER_ROLE) {
        _unpause();
    }

    // Mint new tokens (respecting cap)
    function mint(address to, uint256 amount) public onlyRole(MINTER_ROLE) {
        _mint(to, amount);
    }

    // Batch airdrop function
    function airdrop(address[] calldata recipients, uint256[] calldata amounts)
        external
        onlyRole(MINTER_ROLE)
    {
        if (recipients.length != amounts.length) revert ArrayLengthMismatch();

        uint256 totalAmount = 0;
        for (uint256 i = 0; i < recipients.length; i++) {
            totalAmount += amounts[i];
        }

        require(totalSupply() + totalAmount <= cap(), "Cap exceeded");

        for (uint256 i = 0; i < recipients.length; i++) {
            _mint(recipients[i], amounts[i]);
        }
    }

    // Ensure cap is enforced + paused state blocks transfers
    function _update(address from, address to, uint256 amount)
        internal
        override(ERC20, ERC20Capped)
    {
        require(!paused(), "Token transfers are paused");
        super._update(from, to, amount);
    }
}
