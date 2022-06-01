# CryptoAds

Welcome to CryptoAds! A decentralized classified ads dApp and multi-purpose ecosystem where you can buy and sell pre-loved items, services, collectibles, antiques, rare items, NFTs, artwork and more!

We produce a colossal amount of goods every year, rather than ending up in landfill it is better reuse. Every time we buy a new item we leave a small footprint on the planet. It's estimated that in textile waste alone, 92 million tons are created globally each year! Apps like Gumtree, Wallapop and Depop are hugely popular and the second hand market valuation is huge, yet no blockchain based versions of these apps exist.

This is a shame, because Ethereum provides some particularly useful features for ensuring the successful completion of second hand purchases. CryptoAds leverages these to provide an escrow functionality within it's smart contracts, as well as a reputational proof system to allow people to exchange goods and services with confidence. It's built on a decentralised data storages and is designed to be fully extensible to incentivise second hand selling.

### Architecture

The project uses Ethereum and Solidity for the Smart Contract logic, with Truffle for testing. I decided to use Infura (and web3) for deployment, as the API was nice and easy to use.

The listing data is stored in IPFS in two ways - the image data is stored via web3.storage and the hash returned is then stored in the smart contracts. The metadata for the listings, and other application data is stored in OrbitDB.

Chainlink Keepers are used to ensure that after an auction or listing ends, that all funds are returned to unsuccessful buyers.

![CryptoAds Architecture overview](https://lucid.app/publicSegments/view/45498d32-48d7-4034-a7f4-a04675e1de17/image.jpeg)

### How it works

CryptoAds allows users to list items and services for sale, and to make offers on these items, securing their data in IPFS and providing provenance support through storing those hashes in smart contracts.

It provides two ways of doing this: either a standard listing or an auction.

In a standard listing the price is set, and after making an offer, buyers arrange with the seller to organize the exchange. During the exchange, when the buyer is in possession of the items they can "Confirm the purchase" in the app - which the seller can then verify before parting ways. Once a purchase is confirmed, any unsuccessful offers are refunded.

The images the user uploads of their item are stored in IPFS, through filecoin and web3.storage. The metadata for the listing is stored in OrbitDB.

Listings are currently kept for seven days - if nobody confirms a buy in this time, Chainlink Keepers are used to refund all buyers.

In an auction, the listed price is a minimum, and buyers are able to offer any amount above this. For the seller, there is an additional step since they must accept an offer before the buyer can confirm the purchase.

For any type of listing, the seller may provide the Ethereum wallet address of a trusted third party, such as an estate agent, auction house or possibly a local shop. They leave their item with the third party, who handles the rest of the transactions for them. Usually, the seller will pick somebody a buyer is also likely to trust, so that the goods can be exchanged easily.

After a purchase is confirmed, the buyer and seller are now able to leave a review of each other. Over time, users increase their reputation by accumulating positive ratings, which facilitates new types of trade, such as exchange via post. With a high enough rating, a buyer may feel confident enough to confirm a purchase before receiving the goods.

### Folder Structure

-   evm: contains the smart contract logic and tests, as well as deployment scripts and some utility functions to interact with the smart contract
-   backend: contains the backend services to connect to IPFS via web3.storage, and OrbitDB for saving listings metadata.
-   frontend-nextjs: is the React and tailwindfront-end application for interacting with the smart contracts

There's a further README.md in each sub directory with details on how to run each part of the application. In short, if you want to run #CryptoAds locally, you'll need to follow the instructions in the respective readme's in the order listed before (evm, be-CryptoAds and finally front-end).

# Tools Used

-   Infura - for smart contract deployment, scripting and upgrades
-   web3.storage - for pinning listing image data in IPFS
-   orbitDB - for storing listing metadata
-   Solidity / Ethereum - for the smart contracts
-   Chainlink Keepers - to ensure that potential buyers are refunded if the sale does not complete
-   React / tailwind - for the front-end

# Author
- Ankush and Ronit