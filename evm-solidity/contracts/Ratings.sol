// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import "../contracts/AccessControl.sol";
import "./Listings.sol";
import "./Barrio.sol";

contract Ratings is AccessControl {
    mapping(address => uint256[]) public sellerRatings;
    mapping(address => uint256[]) public buyerRatings;

    mapping(string => bool) public ratedIpfsListingsForSeller;
    mapping(string => bool) public ratedIpfsListingsListingsForBuyer;

    Listings public listingsContract;
    Barrio public barrioContract;

    event RatingRecieved(string ipfsHash, uint256 rating);

    constructor(address _listingsContract, address _barrioContract) {
        listingsContract = Listings(_listingsContract);
        barrioContract = Barrio(_barrioContract);
    }

    function leaveSellerRating(string memory ipfsHash, uint256 rating) public {
        (
            address payable sellerAddress,
            ,
            address finalBuyer,
            ,
            ,
            ,
            bool bought,
            ,
            address payable useThirdPartyAddress
        ) = listingsContract.listings(ipfsHash);

        require(sellerAddress != address(0x0), "This listing does not exist");
        require(
            bought == true,
            "You can only leave a rating on a finalized purchase"
        );
        require(
            finalBuyer == msg.sender,
            "A different final buyer exists for this listing"
        );
        require(
            ratedIpfsListingsForSeller[ipfsHash] == false,
            "A rating has already been left for the seller of this listing"
        );
        require(rating >= 0, "Can't send a negative rating");
        require(rating <= 5, "You can only rate up to 5");

        emit RatingRecieved(ipfsHash, rating);

        ratedIpfsListingsForSeller[ipfsHash] = true;

        // if they used a third party, the reviews go to them
        if (useThirdPartyAddress != address(0x0)) {
            sellerRatings[useThirdPartyAddress].push(rating);
        } else {
            sellerRatings[sellerAddress].push(rating);
        }

        barrioContract.provideRewards(msg.sender);
    }

    function leaveBuyerRating(string memory ipfsHash, uint256 rating) public {
        (
            address payable sellerAddress,
            ,
            address finalBuyer,
            ,
            ,
            ,
            bool bought,
            ,

        ) = listingsContract.listings(ipfsHash);

        require(sellerAddress != address(0x0), "This listing does not exist");
        require(
            finalBuyer != address(0x0),
            "This listing doesn't have a final buyer yet"
        );

        require(
            bought == true,
            "You can only leave a rating on a finalized purchase"
        );
        require(
            sellerAddress == msg.sender,
            "Only the seller of a listing can review the buyer"
        );
        require(
            ratedIpfsListingsListingsForBuyer[ipfsHash] == false,
            "A rating has already been left for the buyer of this listing"
        );
        require(rating >= 0, "Can't send a negative rating");
        require(rating <= 5, "You can only rate up to 5");

        ratedIpfsListingsListingsForBuyer[ipfsHash] = true;
        buyerRatings[finalBuyer].push(rating);

        emit RatingRecieved(ipfsHash, rating);

        barrioContract.provideRewards(msg.sender);
    }

    function sellerRatingAvailable(string memory ipfsHash)
        public
        view
        returns (bool)
    {
        (, , , , , , bool bought, , ) = listingsContract.listings(ipfsHash);

        return !ratedIpfsListingsForSeller[ipfsHash] && bought;
    }

    function buyerRatingAvailable(string memory ipfsHash)
        public
        view
        returns (bool)
    {
        (, , , , , , bool bought, , ) = listingsContract.listings(ipfsHash);

        return !ratedIpfsListingsListingsForBuyer[ipfsHash] && bought;
    }

    function getSellerRatings(address seller)
        public
        view
        returns (uint256[] memory)
    {
        uint256[] memory ratings = new uint256[](sellerRatings[seller].length);
        for (uint256 i = 0; i < sellerRatings[seller].length; i++) {
            ratings[i] = sellerRatings[seller][i];
        }
        return ratings;
    }

    function getBuyerRatings(address seller)
        public
        view
        returns (uint256[] memory)
    {
        uint256[] memory ratings = new uint256[](buyerRatings[seller].length);
        for (uint256 i = 0; i < buyerRatings[seller].length; i++) {
            ratings[i] = buyerRatings[seller][i];
        }
        return ratings;
    }
}
