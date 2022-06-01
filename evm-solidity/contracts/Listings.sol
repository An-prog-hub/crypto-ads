// SPDX-License-Identifier: MIT
pragma solidity 0.8.7;

import "@chainlink/contracts/src/v0.8/KeeperCompatible.sol";

import "./AccessControl.sol";

/// @title Listings manages buying and selling of listed items
contract Listings is AccessControl, KeeperCompatible {
    /// @dev used to store information about a Listing
    struct Listing {
        address payable sellerAddress;
        mapping(address => uint256) buyerAddresses;
        address payable[] buyerAddressesArray;
        address acceptedBuyer;
        address finalBuyer;
        uint256 price;
        bool priceIsInUSD;
        uint256 date;
        bool bought;
        bool isAuction;
        address payable useThirdPartyAddress;
    }

    /// @dev stores all of the submitted Listings
    mapping(string => Listing) public listings;
    /// @dev Also store listings hash as an array in order to loop over later during upkeep
    string[] public listingsArray;

    /// @dev emitted whenever a new listing is submitted
    event ListingSubmitted(
        address sellerAddress,
        string ipfsHash,
        uint256 price
    );

    /// @dev emitted whenever an offer is made on a listing from a seller
    event OfferMade(address buyerAddress, string ipfsHash, uint256 amount);

    /// @dev emitted whenever an offer is accepted on an auction (only auctions)
    event OfferAccepted(address buyerAddress, string ipfsHash, uint256 amount);

    /// @dev emitted whenever a buy is confirmed on a listing
    event BuyConfirmed(address buyerAddress, string ipfsHash, uint256 amount);

    uint256 public lastTimeStamp;
    uint256 public interval = 1814400000; // three weeks

    constructor() {
        lastTimeStamp = block.timestamp;
    }

    /// @dev Change the interval used for wiping data
    function setInterval(uint256 newInterval) public whenNotPaused onlyCLevel {
        interval = newInterval;
    }

    function createThirdPartyListing(
        string memory ipfsHash,
        uint256 price,
        bool isAuction,
        bool priceIsInUSD,
        address payable useThirdPartyAddress
    ) public payable whenNotPaused {
        createListing(ipfsHash, price, isAuction, priceIsInUSD);

        listings[ipfsHash].useThirdPartyAddress = useThirdPartyAddress;
    }

    /// @dev List an item for sale, where the metadata is stored in IPFS
    function createListing(
        string memory ipfsHash,
        uint256 price,
        bool isAuction,
        bool priceIsInUSD
    ) public payable whenNotPaused {
        require(
            listings[ipfsHash].sellerAddress == address(0x0),
            "There is already a listing using this IPFS hash"
        );

        listings[ipfsHash].sellerAddress = payable(msg.sender);
        listings[ipfsHash].price = price;
        listings[ipfsHash].date = block.timestamp;
        listings[ipfsHash].priceIsInUSD = false;
        listings[ipfsHash].isAuction = isAuction;
        listings[ipfsHash].priceIsInUSD = priceIsInUSD;

        listingsArray.push(ipfsHash);

        emit ListingSubmitted(msg.sender, ipfsHash, price);
    }

    /// @dev Make an offer to buy a listing
    function makeOffer(string memory ipfsHash) public payable whenNotPaused {
        require(
            listings[ipfsHash].sellerAddress != msg.sender,
            "You are a seller of this listing, you cannot make an offer"
        );
        require(
            listings[ipfsHash].bought == false,
            "This listing is already bought"
        );
        require(
            listings[ipfsHash].finalBuyer == address(0x0),
            "There is already a final buyer associated with this listing"
        );
        canMakeNewOffer(ipfsHash);
        require(
            listings[ipfsHash].price <= msg.value,
            "Your offer does not meet the minimum listed price"
        );
        require(
            listings[ipfsHash].buyerAddresses[msg.sender] < msg.value,
            "To make a new offer on this listing you need to enter a higher amount than your previous offer"
        );
        listings[ipfsHash].buyerAddresses[msg.sender] = msg.value;
        listings[ipfsHash].buyerAddressesArray.push(payable(msg.sender));

        emit OfferMade(msg.sender, ipfsHash, msg.value);
    }

    function canMakeNewOffer(string memory ipfsHash) private view {
        if (listings[ipfsHash].isAuction) {
            uint256 highestBid = highestOffer(ipfsHash);

            require(
                highestBid < msg.value,
                "To make a new offer on this listing you need to enter a higher amount than the current highest offer"
            );
        } else {
            require(
                listings[ipfsHash].buyerAddresses[msg.sender] == 0,
                "You've already made an offer on this listing"
            );
        }
    }

    /// @dev Confirm a buy has taken place and transfer funds
    function confirmBuy(string memory ipfsHash) public whenNotPaused {
        require(
            listings[ipfsHash].buyerAddresses[msg.sender] > 0,
            "There is no offer associated with this buyer"
        );
        require(
            listings[ipfsHash].bought == false,
            "This listing has already been sold"
        );
        require(
            listings[ipfsHash].finalBuyer == address(0x0),
            "This listing already has a final buyer"
        );
        require(
            ifAuctionEnsureOfferAccepted(ipfsHash),
            "The listing is an auction and an offer hasn't been approved by this wallet"
        );

        for (
            uint256 i = 0;
            i < listings[ipfsHash].buyerAddressesArray.length;
            i++
        ) {
            if (listings[ipfsHash].buyerAddressesArray[i] != msg.sender) {
                listings[ipfsHash].buyerAddressesArray[i].transfer(
                    listings[ipfsHash].buyerAddresses[
                        listings[ipfsHash].buyerAddressesArray[i]
                    ]
                );
            } else {
                if (listings[ipfsHash].useThirdPartyAddress != address(0x0)) {
                    listings[ipfsHash].useThirdPartyAddress.transfer(
                        listings[ipfsHash].buyerAddresses[
                            listings[ipfsHash].buyerAddressesArray[i]
                        ]
                    );
                } else {
                    listings[ipfsHash].sellerAddress.transfer(
                        listings[ipfsHash].buyerAddresses[
                            listings[ipfsHash].buyerAddressesArray[i]
                        ]
                    );
                }
            }
        }

        listings[ipfsHash].bought = true;
        listings[ipfsHash].finalBuyer = msg.sender;

        emit BuyConfirmed(
            msg.sender,
            ipfsHash,
            listings[ipfsHash].buyerAddresses[msg.sender]
        );
    }

    function acceptOffer(string memory ipfsHash, address buyerToAccept)
        public
        whenNotPaused
    {
        require(
            listings[ipfsHash].isAuction == true,
            "Offers can only be accepted for auctions"
        );
        require(
            listings[ipfsHash].sellerAddress == msg.sender,
            "Only the seller can accept an offer"
        );
        require(
            listings[ipfsHash].finalBuyer == address(0x0),
            "A final buyer already exists for this listing"
        );
        require(
            listings[ipfsHash].buyerAddresses[buyerToAccept] > 0,
            "This address has not made an offer to accept"
        );
        require(
            listings[ipfsHash].acceptedBuyer == address(0x0),
            "You've already accepted a different offer"
        );

        listings[ipfsHash].acceptedBuyer = buyerToAccept;
        listings[ipfsHash].price = listings[ipfsHash].buyerAddresses[
            buyerToAccept
        ];

        emit OfferAccepted(
            buyerToAccept,
            ipfsHash,
            listings[ipfsHash].buyerAddresses[buyerToAccept]
        );
    }

    function ifAuctionEnsureOfferAccepted(string memory ipfsHash)
        private
        view
        returns (bool)
    {
        if (!listings[ipfsHash].isAuction) return true;
        if (listings[ipfsHash].acceptedBuyer == msg.sender) return true;
        return false;
    }

    /// @dev Called during performUpkeep to empty unused funds
    function removeListing(string memory ipfsHash) private {
        for (
            uint256 i = 0;
            i < listings[ipfsHash].buyerAddressesArray.length;
            i++
        ) {
            listings[ipfsHash].buyerAddressesArray[i].transfer(
                listings[ipfsHash].price
            );
        }

        listings[ipfsHash].bought = true;
    }

    function checkUpkeep(bytes calldata)
        external
        view
        override
        returns (bool upkeepNeeded, bytes memory performData)
    {
        string[] memory listingsToRemove = new string[](listingsArray.length);

        bool updateNeeded = false;
        for (uint256 i = 0; i < listingsArray.length; i++) {
            if (checkDateIsOlderThanInterval(listings[listingsArray[i]].date)) {
                listingsToRemove[i] = listingsArray[i];
                updateNeeded = true;
            }
        }

        if (updateNeeded) {
            performData = abi.encode(listingsToRemove);
            return (true, performData);
        } else {
            string[] memory emptyListing;
            performData = abi.encode(emptyListing);
            return (false, performData);
        }
    }

    function performUpkeep(bytes calldata performData) external override {
        string[] memory decodedValue = abi.decode(performData, (string[]));

        for (uint256 i = 0; i < decodedValue.length; i++) {
            if (checkDateIsOlderThanInterval(listings[decodedValue[i]].date)) {
                removeListing(decodedValue[i]);
            }
        }
    }

    /// @dev Ascertain whether a date is older than the interval (i.e. that it's two weeks old compared to current blocktime)
    function checkDateIsOlderThanInterval(uint256 date)
        private
        view
        returns (bool)
    {
        return date < block.timestamp - interval;
    }

    function getListingsArray() public view returns (string[] memory) {
        string[] memory allListings = new string[](listingsArray.length);
        for (uint256 i = 0; i < listingsArray.length; i++) {
            allListings[i] = listingsArray[i];
        }
        return allListings;
    }

    function getBuyersForListing(string memory ipfsHash)
        public
        view
        returns (address[] memory)
    {
        require(
            listings[ipfsHash].sellerAddress != address(0x0),
            "This listing does not exist"
        );

        address[] memory buyerAddresses = new address[](
            listings[ipfsHash].buyerAddressesArray.length
        );
        for (
            uint256 i = 0;
            i < listings[ipfsHash].buyerAddressesArray.length;
            i++
        ) {
            buyerAddresses[i] = listings[ipfsHash].buyerAddressesArray[i];
        }
        return buyerAddresses;
    }

    function getPriceForListing(string memory ipfsHash)
        public
        view
        returns (uint256)
    {
        require(
            listings[ipfsHash].sellerAddress != address(0x0),
            "This listing does not exist"
        );

        uint256 price = listings[ipfsHash].price;
        return price;
    }

    function getHighestBuyerForAuction(string memory ipfsHash)
        public
        view
        returns (address)
    {
        require(
            listings[ipfsHash].sellerAddress != address(0x0),
            "This listing does not exist"
        );
        require(
            listings[ipfsHash].buyerAddressesArray.length > 0,
            "There are no buyers for this auction"
        );
        address highestBuyer;
        uint256 highestBid = getHighestAmountForAuction(ipfsHash);

        for (
            uint256 i = 0;
            i < listings[ipfsHash].buyerAddressesArray.length;
            i++
        ) {
            if (
                listings[ipfsHash].buyerAddresses[
                    listings[ipfsHash].buyerAddressesArray[i]
                ] == highestBid
            ) {
                highestBuyer = listings[ipfsHash].buyerAddressesArray[i];
            }
        }
        return highestBuyer;
    }

    function getHighestAmountForAuction(string memory ipfsHash)
        public
        view
        returns (uint256)
    {
        require(
            listings[ipfsHash].sellerAddress != address(0x0),
            "This listing does not exist"
        );
        require(
            listings[ipfsHash].buyerAddressesArray.length > 0,
            "There are no buyers for this auction"
        );

        return highestOffer(ipfsHash);
    }

    function highestOffer(string memory ipfsHash)
        private
        view
        returns (uint256)
    {
        uint256 highestBid = 0;
        for (
            uint256 i = 0;
            i < listings[ipfsHash].buyerAddressesArray.length;
            i++
        ) {
            if (
                listings[ipfsHash].buyerAddresses[
                    listings[ipfsHash].buyerAddressesArray[i]
                ] > highestBid
            ) {
                highestBid = listings[ipfsHash].buyerAddresses[
                    listings[ipfsHash].buyerAddressesArray[i]
                ];
            }
        }
        return highestBid;
    }

    function getOfferForBuyerInAuction(string memory ipfsHash, address buyer)
        public
        view
        returns (uint256)
    {
        require(
            listings[ipfsHash].sellerAddress != address(0x0),
            "This listing does not exist"
        );
        require(
            listings[ipfsHash].isAuction == true,
            "Can't get the offer price in an auction - use getPriceForStandardListing instead"
        );

        require(
            listings[ipfsHash].buyerAddresses[buyer] != 0,
            "There are no offers from this address"
        );

        uint256 offer = listings[ipfsHash].buyerAddresses[buyer];
        return offer;
    }

    function getSellerForListing(string memory ipfsHash)
        public
        view
        returns (address)
    {
        require(
            listings[ipfsHash].sellerAddress != address(0x0),
            "This listing does not exist"
        );

        address sellerAddress = listings[ipfsHash].sellerAddress;
        return sellerAddress;
    }

    function getThirdPartyForListing(string memory ipfsHash)
        public
        view
        returns (address)
    {
        require(
            listings[ipfsHash].sellerAddress != address(0x0),
            "This listing does not exist"
        );

        require(
            listings[ipfsHash].useThirdPartyAddress != address(0x0),
            "This listing isn't using a third party"
        );

        address useThirdPartyAddress = listings[ipfsHash].useThirdPartyAddress;
        return useThirdPartyAddress;
    }

    function getDateForListing(string memory ipfsHash)
        public
        view
        returns (uint256)
    {
        require(
            listings[ipfsHash].sellerAddress != address(0x0),
            "This listing does not exist"
        );

        uint256 date = listings[ipfsHash].date;
        return date;
    }

    function getBoughtForListing(string memory ipfsHash)
        public
        view
        returns (bool)
    {
        require(
            listings[ipfsHash].sellerAddress != address(0x0),
            "This listing does not exist"
        );

        bool bought = listings[ipfsHash].bought;
        return bought;
    }

    function getFinalBuyerForListing(string memory ipfsHash)
        public
        view
        returns (address)
    {
        require(
            listings[ipfsHash].sellerAddress != address(0x0),
            "This listing does not exist"
        );

        require(
            listings[ipfsHash].finalBuyer != address(0x0),
            "There is no final buyer for this contract"
        );

        address finalBuyer = listings[ipfsHash].finalBuyer;
        return finalBuyer;
    }

    function getIsAcceptedForListing(string memory ipfsHash)
        public
        view
        returns (bool)
    {
        require(
            listings[ipfsHash].isAuction,
            "Standard listings do not need to be accepted"
        );
        require(
            listings[ipfsHash].sellerAddress != address(0x0),
            "This listing does not exist"
        );

        if (listings[ipfsHash].acceptedBuyer == address(0x0)) {
            return false;
        }
        return true;
    }

    function getIsAuction(string memory ipfsHash) public view returns (bool) {
        require(
            listings[ipfsHash].sellerAddress != address(0x0),
            "This listing does not exist"
        );
        bool isAuction = listings[ipfsHash].isAuction;
        return isAuction;
    }

    function getIsThirdParty(string memory ipfsHash)
        public
        view
        returns (bool)
    {
        require(
            listings[ipfsHash].sellerAddress != address(0x0),
            "This listing does not exist"
        );
        return listings[ipfsHash].useThirdPartyAddress != address(0x0);
    }

    /// @dev this method calls selfdestruct() and removes the contract from the blockchain.
    function kill() public onlyCEO whenNotPaused {
        selfdestruct(ceoAddress);
    }
}
