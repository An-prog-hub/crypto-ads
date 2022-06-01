const Web3 = require("web3");
require("dotenv").config();
// Loading the contract ABI and Bytecode
// (the results of a previous compilation step)
const fs = require("fs");
const { abi: listingAbi, bytecode: listingBytecode } = JSON.parse(
	fs.readFileSync("./build/contracts/Listings.json")
);

const { abi: ratingsAbi, bytecode: ratingsBytecode } = JSON.parse(
	fs.readFileSync("./build/contracts/Ratings.json")
);

async function main() {
	// Configuring the connection to an Ethereum node
	const network = process.env.ETHEREUM_NETWORK;
	const web3 = new Web3(
		new Web3.providers.HttpProvider(
			`https://${network}.infura.io/v3/${process.env.INFURA_PROJECT_ID}`
		)
	);
	// Creating a signing account from a private key
	const signer = web3.eth.accounts.privateKeyToAccount(
		process.env.SIGNER_PRIVATE_KEY
	);
	web3.eth.accounts.wallet.add(signer);

	// Using the signing account to deploy the contract
	const listingcontract = new web3.eth.Contract(listingAbi);
	listingcontract.options.data = listingBytecode;
	const deployTx = listingcontract.deploy();
	const deployedListingContract = await deployTx
		.send({
			from: signer.address,
			gas: 30000000,
		})
		.once("transactionHash", (txhash) => {
			console.log(`Mining deployment transaction ...`);
			console.log(`https://${network}.etherscan.io/tx/${txhash}`);
		});
	// The contract is now deployed on chain!
	console.log(
		`Contract deployed at ${deployedListingContract.options.address}`
	);
	console.log(
		`Add LISTINGS_CONTRACT to the.env file to store the contract address: ${deployedListingContract.options.address}`
	);

	// now we can deploy the Ratings contract
	const ratingsContract = new web3.eth.Contract(ratingsAbi);
	ratingsContract.options.data = ratingsBytecode;

	const deployRatingTx = ratingsContract.deploy({
		arguments: [deployedListingContract.options.address],
	});

	const deployedRatingContract = await deployRatingTx
		.send({
			from: signer.address,
			gas: 30000000,
		})
		.once("transactionHash", (txhash) => {
			console.log(`Mining deployment transaction ...`);
			console.log(`https://${network}.etherscan.io/tx/${txhash}`);
		});
	// The contract is now deployed on chain!
	console.log(
		`Contract deployed at ${deployedRatingContract.options.address}`
	);
	console.log(
		`Add RATINGS_CONTRACT to the.env file to store the contract address: ${deployedRatingContract.options.address}`
	);
}

require("dotenv").config();
main();
