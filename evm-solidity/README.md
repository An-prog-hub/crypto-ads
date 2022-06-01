# Barrio Smart Contracts

This folder contains all the smart contract logic for Barrio, along with a detailed testing. It uses truffle for deployment, and web3 for deployment.

The main contract is `contracts/Listing.sol`. This allows users to create listings and auctions, and to accept and confirm offers. The rating of sellers after a purchase is confirmed happens inside `contracts/Ratings.sol`. This also releases utility token funds to both the buyer and seller, which can later be used on the platform.

# Deployment

There's a node script to deploy to the Ethereum network. In order to deploy, you'll need to create a `.env` file in this directory. It should have the following variables set

```
ETHEREUM_NETWORK (the network you'd liek to connect to)
SIGNER_PRIVATE_KEY (to sign the contract create calls)
INFURA_PROJECT_ID (it uses infura for deployment)
```

Once you've set these variables, to deploy the smart contracts

`node scripts/deploy.js`

This will print to the console the address of the `Listings` and `Ratings` contract. These addresses should be used to update the `.env` file inside `fe-next-barrio` so that the FE client knows where the contracts are.

There's also a script with some scaffolding to interact with the contracts

`node scripts/interactWithListings.js`

Note that if you change the contracts and you'd like to build the FE to work with these new changes, you'll need to compile them (`truffle compile`), and then copy the relevant contract JSON (i.e. from `build/Listings.json`) into the FE public folder (so that the ABI is available at runtime) - this should be copied into: `../fe-next-barrio/public/abi`.

# Truffle Testing

To compile the contracts

`truffle compile`

To migrate the contracts to a test network

`truffle migrate`

Compile the contracts and run the tests

`truffle test`
