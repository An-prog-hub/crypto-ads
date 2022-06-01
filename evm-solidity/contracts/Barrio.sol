// contracts/GLDToken.sol
// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "../contracts/AccessControl.sol";
import "../contracts/Ratings.sol";

contract Barrio is ERC20, AccessControl {
    address public ratingsContractAddress;

    Ratings public ratingsContract;

    constructor(uint256 initialSupply) ERC20("Barrio", "BAR") {
        _mint(msg.sender, initialSupply);
    }

    function setRatingsContractAddress(address _ratingsContract)
        public
        onlyCEO
    {
        ratingsContractAddress = _ratingsContract;
        ratingsContract = Ratings(ratingsContractAddress);
    }

    function provideRewards(address addressToReward)
        external
        onlyRatingsContract
    {
        _mint(addressToReward, 1000);
    }

    modifier onlyRatingsContract() {
        require(msg.sender == address(ratingsContract));
        _;
    }
}
