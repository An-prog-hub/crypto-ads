require("dotenv").config();

const fs = require("fs");
const Web3 = require("web3");

const { abi, bytecode } = JSON.parse(
	fs.readFileSync(
		"/Users/berniesnell/Blockchain/barrio/evm/build/contracts/Listings.json"
	)
);

async function main() {
	const setInterval = async (interval) => {
		const setIntervalData = listings.methods
			.setInterval(interval)
			.encodeABI();

		const tx = await web3.eth.sendTransaction(
			{
				from: signer.address,
				to: address,
				gas: 30000000,
				data: setIntervalData,
			},
			function (err, res) {
				if (err) console.log(err, "ERR:setInterval");
				if (res) console.log(res, "RES:setInterval");
			}
		);
		console.log(tx, "TX:setInterval");
	};

	const createListing = async (ipfsHash, price) => {
		const createListing = listings.methods
			.createListing(ipfsHash, price)
			.encodeABI();

		const tx = await web3.eth.sendTransaction(
			{
				from: signer.address,
				to: address,
				gas: 30000000,
				data: createListing,
			},
			function (err, res) {
				if (err) console.log(err, "ERR:createListing");
				if (res) console.log(res, "RES:createListing");
			}
		);
		console.log(tx, "TX:createListing");
	};

	const getAllListings = async () => {
		const getListingsArray = listings.methods
			.getListingsArray()
			.encodeABI();

		const tx = await web3.eth.sendTransaction(
			{
				from: signer.address,
				to: address,
				gas: 30000000,
				data: getListingsArray,
			},
			function (err, res) {
				if (err) console.log(err, "ERR:getListingsArray");
				if (res) console.log(res, "RES:getListingsArray");
			}
		);
		console.log(tx, "TX:getListingsArray");
	};

	const network = process.env.ETHEREUM_NETWORK;

	// Set up web3 object, connected to the local development network
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

	const address = process.env.LISTINGS_CONTRACT;
	// const listings = new web3.eth.Contract(abi, address);
	const rating = new web3.eth.Contract(
		abi,
		"0xF787A55d2cA8EDe397443D258aFa7ED1b5036e8c"
	);

	// uncomment to use these methods on the smart contract
	// await setInterval(604800);
	// await createListing("QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps", 1);
	// await getAllListings();

	const sellerRatingAvailable = rating.methods
		.leaveSellerRating(
			"bafybeiencqnh3jee27xlau5yr2rcoyo46hkc5til4s6q3t6bxgnbwupnqi"
		)
		.encodeABI();

	const tx = await web3.eth.sendTransaction(
		{
			from: signer.address,
			to: "0xF787A55d2cA8EDe397443D258aFa7ED1b5036e8c",
			gas: 30000000,
			data: sellerRatingAvailable,
		},
		function (err, res) {
			if (err) console.log(err, "ERR:sellerRatingAvailable");
			if (res) console.log(res, "RES:sellerRatingAvailable");
		}
	);
	console.log(tx, "TX:getListingsArray");
}

main();
