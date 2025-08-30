// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract PrimoCoin is ERC20 {
    constructor() ERC20("PrimoCoin", "PRIM") {
        _mint(msg.sender, 1000000 * 10**18); // 1,000,000 with 18 decimals
    }
}