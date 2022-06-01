const Listings = artifacts.require("Listings");

contract("Listings.createListing", function (accounts) {
	it("should assert true", async function () {
		await Listings.deployed();
		return assert.isTrue(true);
	});

	it("should store a new listing", async () => {
		const alice = accounts[0];

		const listingContract = await Listings.deployed();
		await listingContract.createListing(
			"QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB",
			1,
			false,
			false,
			{ from: alice, gasPrice: 0 }
		);
	});

	it("should not be able to store more than one listing per ipfs hash", async () => {
		const alice = accounts[0];
		const listingContract = await Listings.deployed();

		let called = false;
		try {
			await listingContract.createListing(
				"QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB",
				1,
				false,
				false,
				{ from: alice, gasPrice: 0 }
			);
		} catch (error) {
			called = true;
			assert(error);
		}

		assert(called);
	});
});

contract("Listings.makeOffer", function (accounts) {
	it("should make an offer on a listing and not allow seller", async () => {
		const alice = accounts[0];
		const bob = accounts[1];

		const listingContract = await Listings.deployed();
		await listingContract.createListing(
			"QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4",
			2,
			false,
			false,
			{ from: alice, gasPrice: 0 }
		);

		await listingContract.makeOffer(
			"QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4",
			{ from: bob, value: 2, gasPrice: 0 }
		);

		let called = false;
		try {
			await listingContract.makeOffer(
				"QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4",
				{ from: alice, value: 2, gasPrice: 0 }
			);
		} catch (err) {
			called = true;
		}

		assert(called);
	});

	it("should hold the money in escrow", async () => {
		const alice = accounts[2];
		const bob = accounts[3];

		const listingContract = await Listings.deployed();

		const bobBalanceBefore = await web3.eth.getBalance(bob);
		const contractBalanceBefore = await web3.eth.getBalance(
			listingContract.address
		);
		const itemPrice = 2;

		await listingContract.createListing(
			"QmYA2fn8cMbVWo4v95RwcwJVyQsNtnEwHerfWR8UNtEwoE",
			itemPrice,
			false,
			false,
			{ from: alice, gasPrice: 0 }
		);

		await listingContract.makeOffer(
			"QmYA2fn8cMbVWo4v95RwcwJVyQsNtnEwHerfWR8UNtEwoE",
			{ from: bob, value: itemPrice, gasPrice: 0 }
		);

		const bobBalanceAfter = await web3.eth.getBalance(bob);
		const contractBalanceAfter = await web3.eth.getBalance(
			listingContract.address
		);

		assert.equal(
			BigInt(bobBalanceAfter),
			BigInt(bobBalanceBefore) - BigInt(itemPrice)
		);
		assert.equal(
			BigInt(contractBalanceAfter),
			BigInt(contractBalanceBefore) + BigInt(itemPrice)
		);
	});

	it("should allow multiple users to make an offer", async () => {
		const alice = accounts[4];
		const bob = accounts[5];
		const charlie = accounts[6];

		const listingContract = await Listings.deployed();
		await listingContract.createListing(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			2,
			false,
			false,
			{ from: alice, gasPrice: 0 }
		);

		await listingContract.makeOffer(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			{ from: bob, value: 2, gasPrice: 0 }
		);

		await listingContract.makeOffer(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			{ from: charlie, value: 2, gasPrice: 0 }
		);
	});

	it("should require the sender to offer enough to match the price", async () => {
		const alice = accounts[7];
		const bob = accounts[8];

		const listingContract = await Listings.deployed();
		await listingContract.createListing(
			"QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB",
			20,
			false,
			false,
			{ from: alice, gasPrice: 0 }
		);

		let called = false;
		try {
			await listingContract.makeOffer(
				"QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB",
				{ from: bob, gasPrice: 0 }
			);
		} catch (error) {
			called = true;
		}
		assert(called);
	});

	it("should not allow you to buy twice", async () => {
		const bob = accounts[1];

		const listingContract = await Listings.deployed();

		let called = false;
		try {
			await listingContract.makeOffer(
				"QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4",
				{ from: bob, value: 2, gasPrice: 0 }
			);
		} catch (error) {
			called = true;
		}
		assert(called);
	});
});

contract("Listings.confirmBuy after it's been bought", function (accounts) {
	it("should fail", async () => {
		const alice = accounts[0];
		const bob = accounts[1];
		const charlie = accounts[2];

		const listingContract = await Listings.deployed();

		const itemPrice = 2;

		await listingContract.createListing(
			"QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB",
			itemPrice,
			false,
			false,
			{ from: alice, gasPrice: 0 }
		);

		await listingContract.makeOffer(
			"QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB",
			{ from: bob, value: itemPrice, gasPrice: 0 }
		);

		await listingContract.confirmBuy(
			"QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB",
			{ from: bob, gasPrice: 0 }
		);

		let called = false;
		try {
			await listingContract.confirmBuy(
				"QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB",
				{ from: bob, gasPrice: 0 }
			);
		} catch (err) {
			called = true;
		}

		assert(called);

		called = false;
		try {
			await listingContract.confirmBuy(
				"QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB",
				{ from: charlie, gasPrice: 0 }
			);
		} catch (err) {
			called = true;
		}

		assert(called);

		try {
			await listingContract.makeOffer(
				"QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB",
				{ from: bob, gasPrice: 0 }
			);
		} catch (err) {
			called = true;
		}

		assert(called);

		called = false;
		try {
			await listingContract.makeOffer(
				"QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB",
				{ from: charlie, gasPrice: 0 }
			);
		} catch (err) {
			called = true;
		}
	});
});
contract("Listings.confirmBuy", function (accounts) {
	it("should transfer the price to the buyer", async () => {
		const alice = accounts[0];
		const bob = accounts[1];

		const listingContract = await Listings.deployed();

		const aliceBalanceBefore = await web3.eth.getBalance(alice);
		const contractBalanceBefore = await web3.eth.getBalance(
			listingContract.address
		);
		const itemPrice = 2;

		await listingContract.createListing(
			"QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB",
			itemPrice,
			false,
			false,
			{ from: alice, gasPrice: 0 }
		);

		await listingContract.makeOffer(
			"QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB",
			{ from: bob, value: itemPrice, gasPrice: 0 }
		);

		await listingContract.confirmBuy(
			"QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB",
			{ from: bob, gasPrice: 0 }
		);

		const aliceBalanceAfter = await web3.eth.getBalance(alice);
		const contractBalanceAfter = await web3.eth.getBalance(
			listingContract.address
		);

		assert.equal(
			BigInt(aliceBalanceAfter),
			BigInt(aliceBalanceBefore) + BigInt(itemPrice)
		);
		assert.equal(
			BigInt(contractBalanceAfter),
			BigInt(contractBalanceBefore)
		);
	});

	it("should refund other buyers held in escrow", async () => {
		const alice = accounts[2];
		const bob = accounts[3];
		const charlie = accounts[4];
		const david = accounts[5];

		const listingContract = await Listings.deployed();

		const bobBalanceBefore = await web3.eth.getBalance(bob);
		const charlieBalanceBefore = await web3.eth.getBalance(charlie);
		const davidBalanceBefore = await web3.eth.getBalance(david);
		const contractBalanceBefore = await web3.eth.getBalance(
			listingContract.address
		);

		const itemPrice = 2;

		await listingContract.createListing(
			"QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4",
			itemPrice,
			false,
			false,
			{ from: alice, gasPrice: 0 }
		);

		await listingContract.makeOffer(
			"QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4",
			{ from: bob, value: itemPrice, gasPrice: 0 }
		);

		await listingContract.makeOffer(
			"QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4",
			{ from: charlie, value: itemPrice, gasPrice: 0 }
		);

		await listingContract.makeOffer(
			"QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4",
			{ from: david, value: itemPrice, gasPrice: 0 }
		);

		const contractBalanceAfterOffers = await web3.eth.getBalance(
			listingContract.address
		);
		assert.equal(
			BigInt(contractBalanceAfterOffers),
			BigInt(contractBalanceBefore) + BigInt(itemPrice * 3)
		);

		await listingContract.confirmBuy(
			"QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4",
			{ from: bob, gasPrice: 0 }
		);

		const bobBalanceAfter = await web3.eth.getBalance(bob);
		const charlieBalanceAfter = await web3.eth.getBalance(charlie);
		const davidBalanceAfter = await web3.eth.getBalance(david);

		// bob is the only one who pays
		assert.equal(
			BigInt(bobBalanceAfter),
			BigInt(bobBalanceBefore) - BigInt(itemPrice)
		);
		assert.equal(BigInt(charlieBalanceBefore), BigInt(charlieBalanceAfter));
		assert.equal(BigInt(davidBalanceBefore), BigInt(davidBalanceAfter));

		// in the end the contract has what it started with
		const contractBalanceAfterConfirm = await web3.eth.getBalance(
			listingContract.address
		);
		assert.equal(
			BigInt(contractBalanceAfterConfirm),
			BigInt(contractBalanceBefore)
		);
	});

	it("can only be confirmed by a seller in the list", async () => {
		const alice = accounts[6];
		const bob = accounts[7];
		const charlie = accounts[8];

		const listingContract = await Listings.deployed();
		const itemPrice = 2;

		await listingContract.createListing(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			itemPrice,
			false,
			false,
			{ from: alice, gasPrice: 0 }
		);

		await listingContract.makeOffer(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			{ from: bob, value: itemPrice, gasPrice: 0 }
		);

		let called = false;
		try {
			await listingContract.confirmBuy(
				"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
				{ from: charlie, gasPrice: 0 }
			);
		} catch (error) {
			called = true;
			assert(error);
		}

		assert(called);
	});
});

contract("Listings.checkUpkeep false", function (accounts) {
	it("should return false for newly added listings", async () => {
		const alice = accounts[0];

		const listingContract = await Listings.deployed();
		const itemPrice = 2;

		await listingContract.createListing(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			itemPrice,
			false,
			false,
			{ from: alice, gasPrice: 0 }
		);

		const upkeep = await listingContract.checkUpkeep([]);

		assert.equal(upkeep.upkeepNeeded, false);
		assert.equal(
			upkeep.performData,
			web3.eth.abi.encodeParameter("string[]", [])
		);
	});
});

// Since this artifically sets the blocktime in the EVM to a week's time
// We need to run it in a separate `contract` block to keep it idempotent
contract("Listings.checkUpkeep true", function (accounts) {
	it("should return true for listings over a week old", async () => {
		const alice = accounts[0];

		const listingContract = await Listings.deployed();
		const itemPrice = 2;

		await listingContract.createListing(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			itemPrice,
			false,
			false,
			{ from: alice, gasPrice: 0 }
		);

		await increase(1814400001);

		const upkeep = await listingContract.checkUpkeep([]);

		assert.equal(upkeep.upkeepNeeded, true);
		assert.equal(
			upkeep.performData,
			web3.eth.abi.encodeParameter("string[]", [
				"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			])
		);
	});
});

// Since this artifically sets the blocktime in the EVM to a week's time
// We need to run it in a separate `contract` block to keep it idempotent
contract("Listings.checkUpkeep multiple true", function (accounts) {
	it("should return true for listings over a week old", async () => {
		const alice = accounts[0];
		const bob = accounts[1];
		const charlie = accounts[2];

		const listingContract = await Listings.deployed();
		const itemPrice = 2;

		await listingContract.createListing(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			itemPrice,
			false,
			false,
			{ from: alice, gasPrice: 0 }
		);

		await listingContract.createListing(
			"QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4",
			itemPrice,
			false,
			false,
			{ from: bob, gasPrice: 0 }
		);

		await listingContract.createListing(
			"QmYA2fn8cMbVWo4v95RwcwJVyQsNtnEwHerfWR8UNtEwoE",
			itemPrice,
			false,
			false,
			{ from: charlie, gasPrice: 0 }
		);

		await increase(1814400001);

		const upkeep = await listingContract.checkUpkeep([]);

		assert.equal(upkeep.upkeepNeeded, true);
		assert.equal(
			upkeep.performData,
			web3.eth.abi.encodeParameter("string[]", [
				"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
				"QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4",
				"QmYA2fn8cMbVWo4v95RwcwJVyQsNtnEwHerfWR8UNtEwoE",
			])
		);
	});
});

async function increase(duration) {
	return new Promise((resolve, reject) => {
		web3.currentProvider.send(
			{
				jsonrpc: "2.0",
				method: "evm_increaseTime",
				params: [duration],
				id: new Date().getTime(),
			},
			(err, result) => {
				// second call within the callback
				web3.currentProvider.send(
					{
						jsonrpc: "2.0",
						method: "evm_mine",
						params: [],
						id: new Date().getTime(),
					},
					(err, result) => {
						// need to resolve the Promise in the second callback
						resolve();
					}
				);
			}
		);
	});
}

contract("Listings.getListingsArray with entries", function (accounts) {
	it("should return the array of listings", async () => {
		const alice = accounts[0];

		const listingContract = await Listings.deployed();
		await listingContract.createListing(
			"QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB",
			1,
			false,
			false,
			{ from: alice, gasPrice: 0 }
		);

		const listingArray = await listingContract.getListingsArray();
		assert.equal(
			"QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB",
			listingArray[0]
		);
	});
});

contract("Listings.getListingsArray empty array", function (accounts) {
	it("should return an empty array of listings when no listings are submitted", async () => {
		const listingContract = await Listings.deployed();

		const listingArray = await listingContract.getListingsArray();
		assert.equal(listingArray.length, 0);
	});
});

contract("Listings.getListingsArray multiple", function (accounts) {
	it("should return multiple listings", async () => {
		const alice = accounts[1];
		const bob = accounts[2];

		const listingContract = await Listings.deployed();

		await listingContract.createListing(
			"QmYA2fn8cMbVWo4v95RwcwJVyQsNtnEwHerfWR8UNtEwoE",
			1,
			false,
			false,
			{ from: alice, gasPrice: 0 }
		);
		await listingContract.createListing(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			1,
			false,
			false,
			{ from: bob, gasPrice: 0 }
		);

		const listingArray = await listingContract.getListingsArray();

		assert.equal(
			"QmYA2fn8cMbVWo4v95RwcwJVyQsNtnEwHerfWR8UNtEwoE",
			listingArray[0]
		);
		assert.equal(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			listingArray[1]
		);
	});
});

contract("Listings.getSellerForListing", function (accounts) {
	it("should return the seller of listing", async () => {
		const alice = accounts[0];

		const listingContract = await Listings.deployed();
		await listingContract.createListing(
			"QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB",
			1,
			false,
			false,
			{ from: alice, gasPrice: 0 }
		);

		const seller = await listingContract.getSellerForListing(
			"QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB"
		);
		assert.equal(seller, alice);
	});

	it("should fail is the listing doesn't exist", async () => {
		const listingContract = await Listings.deployed();

		let called = false;
		try {
			await listingContract.getSellerForListing(
				"QmYA2fn8cMbVWo4v95RwcwJVyQsNtnEwHerfWR8UNtEwoE"
			);
		} catch (e) {
			called = true;
		}
		assert(called);
	});
});

contract("Listings.getPriceForListing", function (accounts) {
	it("should return the price of listing", async () => {
		const alice = accounts[0];

		const listingContract = await Listings.deployed();
		await listingContract.createListing(
			"QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB",
			1,
			false,
			false,
			{ from: alice, gasPrice: 0 }
		);

		const price = await listingContract.getPriceForListing(
			"QmPK1s3pNYLi9ERiq3BDxKa4XosgWwFRQUydHUtz4YgpqB"
		);
		assert.equal(price, 1);
	});

	it("should fail is the listing doesn't exist", async () => {
		const listingContract = await Listings.deployed();

		let called = false;
		try {
			await listingContract.getPriceForListing(
				"QmYA2fn8cMbVWo4v95RwcwJVyQsNtnEwHerfWR8UNtEwoE"
			);
		} catch (e) {
			called = true;
		}
		assert(called);
	});
});

contract("Listings.getBuyersForListing", function (accounts) {
	it("should return a list of buyers for listing", async () => {
		const alice = accounts[0];
		const bob = accounts[1];
		const charlie = accounts[2];

		const listingContract = await Listings.deployed();
		await listingContract.createListing(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			2,
			false,
			false,
			{ from: alice, gasPrice: 0 }
		);

		await listingContract.makeOffer(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			{ from: bob, value: 2, gasPrice: 0 }
		);

		await listingContract.makeOffer(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			{ from: charlie, value: 2 }
		);

		const buyers = await listingContract.getBuyersForListing(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps"
		);

		assert.equal(buyers[0], bob);
		assert.equal(buyers[1], charlie);
	});

	it("should fail is the listing doesn't exist", async () => {
		const listingContract = await Listings.deployed();

		let called = false;
		try {
			await listingContract.getPriceForListing(
				"QmYA2fn8cMbVWo4v95RwcwJVyQsNtnEwHerfWR8UNtEwoE"
			);
		} catch (e) {
			called = true;
		}
		assert(called);
	});
});

contract("Listings.performUpkeep", function (accounts) {
	it("should remove listings that are over a week old", async () => {
		const alice = accounts[0];
		const bob = accounts[1];

		const listingContract = await Listings.deployed();
		const contractBalanceBefore = await web3.eth.getBalance(
			listingContract.address
		);
		const itemPrice = 2;

		await listingContract.createListing(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			itemPrice,
			false,
			false,
			{ from: alice, gasPrice: 0 }
		);

		await listingContract.makeOffer(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			{ from: bob, value: itemPrice, gasPrice: 0 }
		);

		const contractBalanceAfterOffer = await web3.eth.getBalance(
			listingContract.address
		);

		assert.equal(
			BigInt(contractBalanceAfterOffer),
			BigInt(contractBalanceBefore) + BigInt(itemPrice)
		);

		await increase(1814400001);

		await listingContract.performUpkeep(
			web3.eth.abi.encodeParameter("string[]", [
				"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			])
		);

		const contractBalanceAfterUpkeep = await web3.eth.getBalance(
			listingContract.address
		);

		assert.equal(
			BigInt(contractBalanceAfterUpkeep),
			BigInt(contractBalanceBefore)
		);
	});

	it("should not remove listings that are not over a week old", async () => {
		const alice = accounts[2];
		const bob = accounts[3];

		const listingContract = await Listings.deployed();
		const contractBalanceBefore = await web3.eth.getBalance(
			listingContract.address
		);
		const itemPrice = 2;

		await listingContract.createListing(
			"QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4",
			itemPrice,
			false,
			false,
			{ from: alice, gasPrice: 0 }
		);

		await listingContract.makeOffer(
			"QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4",
			{ from: bob, value: itemPrice, gasPrice: 0 }
		);

		const contractBalanceAfterOffer = await web3.eth.getBalance(
			listingContract.address
		);

		assert.equal(
			BigInt(contractBalanceAfterOffer),
			BigInt(contractBalanceBefore) + BigInt(itemPrice)
		);

		await listingContract.performUpkeep(
			web3.eth.abi.encodeParameter("string[]", [
				"QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4",
			])
		);

		const contractBalanceAfterUpkeep = await web3.eth.getBalance(
			listingContract.address
		);

		assert.equal(
			BigInt(contractBalanceAfterUpkeep),
			BigInt(contractBalanceAfterOffer)
		);
	});
});

contract("Listings.makeOffer", function (accounts) {
	it("should let the same buyer place a new higher order in an auction", async () => {
		const alice = accounts[0];
		const bob = accounts[1];

		const itemPrice = 2;

		const listingContract = await Listings.deployed();

		await listingContract.createListing(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			itemPrice,
			true,
			false,
			{ from: alice, gasPrice: 0 }
		);

		await listingContract.makeOffer(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			{ from: bob, value: itemPrice, gasPrice: 0 }
		);

		await listingContract.makeOffer(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			{ from: bob, value: itemPrice + 1, gasPrice: 0 }
		);
	});

	it("should not let the same buyer place the same amount in an auction", async () => {
		const alice = accounts[3];
		const bob = accounts[4];

		const itemPrice = 2;

		const listingContract = await Listings.deployed();

		await listingContract.createListing(
			"QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4",
			itemPrice,
			true,
			false,
			{ from: alice, gasPrice: 0 }
		);

		await listingContract.makeOffer(
			"QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4",
			{ from: bob, value: itemPrice, gasPrice: 0 }
		);

		let called = false;
		try {
			await listingContract.makeOffer(
				"QmRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4",
				{ from: bob, value: itemPrice, gasPrice: 0 }
			);
		} catch (error) {
			called = true;
			assert(error);
		}

		assert(called);
	});

	it("should not let the same buyer make an offer again if it's not an auction", async () => {
		const alice = accounts[6];
		const bob = accounts[7];

		const itemPrice = 2;

		const listingContract = await Listings.deployed();

		await listingContract.createListing(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKtps",
			itemPrice,
			false,
			false,
			{ from: alice, gasPrice: 0 }
		);

		await listingContract.makeOffer(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKtps",
			{ from: bob, value: itemPrice, gasPrice: 0 }
		);

		// not with a higher amount
		let called = false;
		try {
			await listingContract.makeOffer(
				"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKtps",
				{ from: bob, value: itemPrice + 1, gasPrice: 0 }
			);
		} catch (error) {
			called = true;
			assert(error);
		}

		assert(called);

		// neither with the same amount
		called = false;
		try {
			await listingContract.makeOffer(
				"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKtps",
				{ from: bob, value: itemPrice, gasPrice: 0 }
			);
		} catch (error) {
			called = true;
			assert(error);
		}

		assert(called);
	});
});

contract("Listings.makeOffer multiple equal offers", function (accounts) {
	it("should not allow lower or equal bids in an auction", async () => {
		const alice = accounts[0];
		const bob = accounts[1];
		const charlie = accounts[2];

		const itemPrice = 2;

		const listingContract = await Listings.deployed();

		await listingContract.createListing(
			"QrRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4",
			itemPrice,
			true,
			false,
			{ from: alice, gasPrice: 0 }
		);

		let called = false;
		try {
			await listingContract.getThirdPartyForListing(
				"yyyytSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps"
			);
		} catch (error) {
			called = true;
			assert(error);
		}

		assert(called);

		await listingContract.makeOffer(
			"QrRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4",
			{ from: bob, value: itemPrice, gasPrice: 0 }
		);

		called = false;
		try {
			await listingContract.makeOffer(
				"QrRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4",
				{ from: bob, value: 1, gasPrice: 0 }
			);
		} catch (error) {
			called = true;
			assert(error);
		}

		assert(called);

		// charlie can't offer the same amount
		called = false;
		try {
			await listingContract.makeOffer(
				"QrRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4",
				{ from: charlie, value: itemPrice, gasPrice: 0 }
			);
		} catch (error) {
			called = true;
			assert(error);
		}

		assert(called);

		// neither can bob
		called = false;
		try {
			await listingContract.makeOffer(
				"QrRAQB6YaCyidP37UdDnjFY5vQuiBrcqdyoW1CuDgwxkD4",
				{ from: charlie, value: itemPrice, gasPrice: 0 }
			);
		} catch (error) {
			called = true;
			assert(error);
		}

		assert(called);
	});
});

contract("Listings.confirmBuy", function (accounts) {
	it("should not allow buyer to confirm buy in an auction if the seller has accepted a different offer", async () => {
		const alice = accounts[0];
		const bob = accounts[1];
		const charlie = accounts[2];
		const itemPrice = 2;

		const listingContract = await Listings.deployed();

		await listingContract.createListing(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			itemPrice,
			true,
			false,
			{ from: alice, gasPrice: 0 }
		);

		await listingContract.makeOffer(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			{ from: bob, value: itemPrice, gasPrice: 0 }
		);

		await listingContract.makeOffer(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			{ from: charlie, value: itemPrice + 1, gasPrice: 0 }
		);

		await listingContract.acceptOffer(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			charlie,
			{ from: alice, gasPrice: 0 }
		);

		let called = false;
		try {
			await listingContract.confirmBuy(
				"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
				{ from: bob, gasPrice: 0 }
			);
		} catch (error) {
			called = true;
			assert(error);
		}

		assert(called);
	});

	it("should refund everyone properly in an auction", async () => {
		const alice = accounts[3];
		const bob = accounts[4];
		const charlie = accounts[5];
		const itemPrice = 2;

		const listingContract = await Listings.deployed();

		const aliceBalanceBefore = await web3.eth.getBalance(alice);
		const bobBalanceBefore = await web3.eth.getBalance(bob);
		const charlieBalanceBefore = await web3.eth.getBalance(charlie);
		const contractBalanceBefore = await web3.eth.getBalance(
			listingContract.address
		);

		await listingContract.createListing(
			"yyyytSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			itemPrice,
			true,
			false,
			{ from: alice, gasPrice: 0 }
		);

		await listingContract.makeOffer(
			"yyyytSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			{ from: bob, value: itemPrice, gasPrice: 0 }
		);

		const bobBalanceAfter = await web3.eth.getBalance(bob);

		assert.equal(
			BigInt(bobBalanceAfter),
			BigInt(bobBalanceBefore) - BigInt(itemPrice)
		);

		const contractBalanceAfter = await web3.eth.getBalance(
			listingContract.address
		);

		assert.equal(
			BigInt(contractBalanceBefore) + BigInt(itemPrice),
			BigInt(contractBalanceAfter)
		);

		await listingContract.makeOffer(
			"yyyytSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			{ from: charlie, value: itemPrice + 1, gasPrice: 0 }
		);

		const charlieBalanceAfter = await web3.eth.getBalance(charlie);

		assert.equal(
			BigInt(charlieBalanceAfter),
			BigInt(charlieBalanceBefore) - BigInt(itemPrice + 1)
		);

		const contractBalanceAfterCharlie = await web3.eth.getBalance(
			listingContract.address
		);

		assert.equal(
			BigInt(contractBalanceBefore) +
				BigInt(itemPrice) +
				BigInt(itemPrice + 1),
			BigInt(contractBalanceAfterCharlie)
		);

		await listingContract.acceptOffer(
			"yyyytSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			charlie,
			{ from: alice, gasPrice: 0 }
		);

		assert.equal(
			BigInt(contractBalanceBefore) +
				BigInt(itemPrice) +
				BigInt(itemPrice + 1),
			BigInt(contractBalanceAfterCharlie)
		);

		await listingContract.confirmBuy(
			"yyyytSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			{ from: charlie, gasPrice: 0 }
		);
		const aliceBalanceAfterConfirm = await web3.eth.getBalance(alice);
		const bobBalanceAfterConfirm = await web3.eth.getBalance(bob);
		const charlieBalanceAfterConfirm = await web3.eth.getBalance(charlie);
		const contractBalanceAfterConfirm = await web3.eth.getBalance(
			listingContract.address
		);

		assert.equal(
			BigInt(contractBalanceBefore),
			BigInt(contractBalanceAfterConfirm)
		);
		assert.equal(BigInt(bobBalanceBefore), BigInt(bobBalanceAfterConfirm));
		assert.equal(
			BigInt(aliceBalanceBefore) + BigInt(itemPrice + 1),
			BigInt(aliceBalanceAfterConfirm)
		);
		assert.equal(
			BigInt(charlieBalanceBefore) - BigInt(itemPrice + 1),
			BigInt(charlieBalanceAfterConfirm)
		);
	});

	it("should not allow buyer to confirm buy in an action before the seller has accepted their offer", async () => {
		const alice = accounts[3];
		const bob = accounts[4];
		const itemPrice = 2;

		const listingContract = await Listings.deployed();

		await listingContract.createListing(
			"RmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			itemPrice,
			true,
			false,
			{ from: alice, gasPrice: 0 }
		);

		await listingContract.makeOffer(
			"RmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			{ from: bob, value: itemPrice, gasPrice: 0 }
		);

		let called = false;
		try {
			await listingContract.confirmBuy(
				"RmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
				{ from: bob, gasPrice: 0 }
			);
		} catch (error) {
			called = true;
			assert(error);
		}

		assert(called);
	});
});

contract("Listings.acceptOffer", function (accounts) {
	it("should allow seller to accept a bid", async () => {
		const alice = accounts[0];
		const bob = accounts[1];
		const itemPrice = 2;

		const listingContract = await Listings.deployed();

		await listingContract.createListing(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			itemPrice,
			true,
			false,
			{ from: alice, gasPrice: 0 }
		);

		await listingContract.makeOffer(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			{ from: bob, value: itemPrice, gasPrice: 0 }
		);

		await listingContract.acceptOffer(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			bob,
			{ from: alice, gasPrice: 0 }
		);
	});

	it("should not allow seller to accept a bid that doesn't exist", async () => {
		const alice = accounts[2];
		const bob = accounts[3];
		const itemPrice = 2;

		const listingContract = await Listings.deployed();

		await listingContract.createListing(
			"ppV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			itemPrice,
			true,
			false,
			{ from: alice, gasPrice: 0 }
		);

		let called = false;
		try {
			await listingContract.acceptOffer(
				"ppV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
				bob,
				{ from: alice, gasPrice: 0 }
			);
		} catch (error) {
			called = true;
			assert(error);
		}

		assert(called);
	});

	it("should not allow seller to accept a bid if it's not an auction", async () => {
		const alice = accounts[4];
		const bob = accounts[5];
		const itemPrice = 2;

		const listingContract = await Listings.deployed();

		await listingContract.createListing(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKggg",
			itemPrice,
			false,
			false,
			{ from: alice, gasPrice: 0 }
		);

		await listingContract.makeOffer(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKggg",
			{ from: bob, value: itemPrice, gasPrice: 0 }
		);

		let called = false;
		try {
			await listingContract.acceptOffer(
				"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKggg",
				charlie,
				{ from: alice, gasPrice: 0 }
			);
		} catch (error) {
			called = true;
			assert(error);
		}

		assert(called);
	});

	it("should not allow others to accept a bid in an auction", async () => {
		const alice = accounts[6];
		const bob = accounts[7];
		const itemPrice = 2;

		const listingContract = await Listings.deployed();

		await listingContract.createListing(
			"YmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			itemPrice,
			true,
			false,
			{ from: alice, gasPrice: 0 }
		);

		await listingContract.makeOffer(
			"YmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			{ from: bob, value: itemPrice, gasPrice: 0 }
		);

		let called = false;
		try {
			await listingContract.acceptOffer(
				"YmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
				charlie,
				{ from: bob, gasPrice: 0 }
			);
		} catch (error) {
			called = true;
			assert(error);
		}

		assert(called);
	});

	it("should not allow seller to accept a second offer", async () => {
		const alice = accounts[0];
		const bob = accounts[1];
		const charlie = accounts[2];

		const itemPrice = 2;

		const listingContract = await Listings.deployed();

		await listingContract.createListing(
			"YmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKooo",
			itemPrice,
			true,
			false,
			{ from: alice, gasPrice: 0 }
		);

		await listingContract.makeOffer(
			"YmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKooo",
			{ from: bob, value: itemPrice, gasPrice: 0 }
		);

		await listingContract.makeOffer(
			"YmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKooo",
			{ from: charlie, value: itemPrice + 1, gasPrice: 0 }
		);

		let accepted = await listingContract.getIsAcceptedForListing(
			"YmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKooo",
			{ from: alice, gasPrice: 0 }
		);

		assert.equal(accepted, false);

		await listingContract.acceptOffer(
			"YmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKooo",
			bob,
			{ from: alice, gasPrice: 0 }
		);

		accepted = await listingContract.getIsAcceptedForListing(
			"YmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKooo",
			{ from: alice, gasPrice: 0 }
		);

		assert.equal(accepted, true);

		let called = false;
		try {
			await listingContract.acceptOffer(
				"YmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKooo",
				charlie,
				{ from: alice, gasPrice: 0 }
			);
		} catch (error) {
			called = true;
			assert(error);
		}

		assert(called);
	});
});

contract("Listings.getIsAcceptedForListing", function (accounts) {
	it("should not allow seller to accept a second offer", async () => {
		const alice = accounts[0];
		const bob = accounts[1];
		const charlie = accounts[2];
		const itemPrice = 2;

		const listingContract = await Listings.deployed();

		await listingContract.createListing(
			"YmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKooo",
			itemPrice,
			true,
			false,
			{ from: alice, gasPrice: 0 }
		);

		await listingContract.makeOffer(
			"YmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKooo",
			{ from: bob, value: itemPrice, gasPrice: 0 }
		);

		await listingContract.makeOffer(
			"YmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKooo",
			{ from: charlie, value: itemPrice + 1, gasPrice: 0 }
		);

		let accepted = await listingContract.getIsAcceptedForListing(
			"YmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKooo",
			{ from: alice, gasPrice: 0 }
		);

		assert.equal(accepted, false);

		await listingContract.acceptOffer(
			"YmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKooo",
			bob,
			{ from: alice, gasPrice: 0 }
		);

		accepted = await listingContract.getIsAcceptedForListing(
			"YmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKooo",
			{ from: alice, gasPrice: 0 }
		);

		assert.equal(accepted, true);

		let called = false;
		try {
			await listingContract.acceptOffer(
				"YmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKooo",
				charlie,
				{ from: alice, gasPrice: 0 }
			);
		} catch (error) {
			called = true;
			assert(error);
		}

		assert(called);
	});
});

contract("Listings.getIsAuction", function (accounts) {
	it("getIsAuction should return true for auctions", async () => {
		const alice = accounts[0];
		const itemPrice = 2;

		const listingContract = await Listings.deployed();

		await listingContract.createListing(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			itemPrice,
			true,
			false,
			{ from: alice, gasPrice: 0 }
		);

		const auction = await listingContract.getIsAuction(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps"
		);
		assert(auction);
	});

	it("getIsAuction should return false for standard listings", async () => {
		const alice = accounts[1];
		const itemPrice = 2;

		const listingContract = await Listings.deployed();

		await listingContract.createListing(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGgg",
			itemPrice,
			false,
			false,
			{ from: alice, gasPrice: 0 }
		);

		const auction = await listingContract.getIsAuction(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGgg"
		);
		assert(!auction);
	});
});

contract(
	"Listings.getHighestAmountForAuction and getHighestBuyerForAuction",
	function (accounts) {
		it("should return the highest offer and buyer for a listings", async () => {
			const alice = accounts[0];
			const bob = accounts[1];
			const charlie = accounts[2];

			const itemPrice = 2;

			const listingContract = await Listings.deployed();

			await listingContract.createListing(
				"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
				itemPrice,
				true,
				false,
				{ from: alice, gasPrice: 0 }
			);

			// fails before there are any buyers
			let called = false;
			try {
				await listingContract.getHighestAmountForAuction(
					"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps"
				);
			} catch (error) {
				called = true;
				assert(error);
			}

			assert(called);

			called = false;
			try {
				await listingContract.getHighestBuyerForAuction(
					"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps"
				);
			} catch (error) {
				called = true;
				assert(error);
			}

			assert(called);

			await listingContract.makeOffer(
				"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
				{ from: bob, value: itemPrice, gasPrice: 0 }
			);

			highestBid = await listingContract.getHighestAmountForAuction(
				"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps"
			);
			highestBuyer = await listingContract.getHighestBuyerForAuction(
				"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps"
			);
			assert.equal(BigInt(highestBid), BigInt(itemPrice));
			assert.equal(highestBuyer, bob);

			await listingContract.makeOffer(
				"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
				{ from: charlie, value: itemPrice + 1, gasPrice: 0 }
			);

			highestBid = await listingContract.getHighestAmountForAuction(
				"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps"
			);
			highestBuyer = await listingContract.getHighestBuyerForAuction(
				"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps"
			);
			assert.equal(BigInt(highestBid), BigInt(itemPrice + 1));
			assert.equal(highestBuyer, charlie);

			await listingContract.makeOffer(
				"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
				{ from: bob, value: itemPrice + 2, gasPrice: 0 }
			);

			highestBid = await listingContract.getHighestAmountForAuction(
				"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps"
			);
			highestBuyer = await listingContract.getHighestBuyerForAuction(
				"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps"
			);
			assert.equal(BigInt(highestBid), BigInt(itemPrice + 2));
			assert.equal(highestBuyer, bob);
		});
	}
);

contract("Listings.getDateForListing", function (accounts) {
	it("should return the block timestamp for when the listing was created", async () => {
		const alice = accounts[0];

		const itemPrice = 2;

		const listingContract = await Listings.deployed();

		await listingContract.createListing(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			itemPrice,
			true,
			false,
			{ from: alice, gasPrice: 0 }
		);

		const date = await listingContract.getDateForListing(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",

			{ from: alice, gasPrice: 0 }
		);

		assert(date);
	});
});

contract("Listings.getIsThirdParty", function (accounts) {
	it("should return whether the listing uses a third party", async () => {
		const alice = accounts[0];
		const bob = accounts[1];

		const itemPrice = 2;

		const listingContract = await Listings.deployed();

		await listingContract.createListing(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			itemPrice,
			true,
			false,
			{ from: alice, gasPrice: 0 }
		);

		await listingContract.createThirdPartyListing(
			"ccccccSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			itemPrice,
			false,
			false,
			alice,
			{ from: bob, gasPrice: 0 }
		);

		const isNotThirdPartyListing = await listingContract.getIsThirdParty(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",

			{ from: alice, gasPrice: 0 }
		);

		assert(!isNotThirdPartyListing);

		const isThirdPartyListing = await listingContract.getIsThirdParty(
			"ccccccSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",

			{ from: alice, gasPrice: 0 }
		);

		assert(isThirdPartyListing);
	});
});

contract("Listings.getOfferForBuyerInAuction", function (accounts) {
	it("getOfferForBuyerInAuction should fail if the buyer isn't in the list", async () => {
		const alice = accounts[0];
		const bob = accounts[1];

		const itemPrice = 2;

		const listingContract = await Listings.deployed();

		await listingContract.createListing(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			itemPrice,
			true,
			false,
			{ from: alice, gasPrice: 0 }
		);

		// fails before there are any buyers
		let called = false;
		try {
			await listingContract.getOfferForBuyerInAuction(
				"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
				bob
			);
		} catch (error) {
			called = true;
			assert(error);
		}

		assert(called);
	});

	it("getOfferForBuyerInAuction should fail if it's a standard listing", async () => {
		const alice = accounts[2];
		const bob = accounts[3];

		const itemPrice = 2;

		const listingContract = await Listings.deployed();

		await listingContract.createListing(
			"xxx9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			itemPrice,
			false,
			false,
			{ from: alice, gasPrice: 0 }
		);

		await listingContract.makeOffer(
			"xxx9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			{ from: bob, value: itemPrice, gasPrice: 0 }
		);

		let called = false;
		try {
			await listingContract.getOfferForBuyerInAuction(
				"xxx9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
				bob
			);
		} catch (error) {
			called = true;
			assert(error);
		}

		assert(called);
	});

	it("getOfferForBuyerInAuction should return the offer the buyer made for an auction", async () => {
		const alice = accounts[4];
		const bob = accounts[5];
		const charlie = accounts[6];

		const itemPrice = 2;

		const listingContract = await Listings.deployed();

		await listingContract.createListing(
			"tttttSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			itemPrice,
			true,
			false,
			{ from: alice, gasPrice: 0 }
		);

		await listingContract.makeOffer(
			"tttttSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			{ from: bob, value: itemPrice, gasPrice: 0 }
		);

		let offer = await listingContract.getOfferForBuyerInAuction(
			"tttttSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			bob
		);

		assert.equal(BigInt(offer), BigInt(itemPrice));

		await listingContract.makeOffer(
			"tttttSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			{ from: charlie, value: itemPrice + 1, gasPrice: 0 }
		);

		offer = await listingContract.getOfferForBuyerInAuction(
			"tttttSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			charlie
		);

		assert.equal(BigInt(offer), BigInt(itemPrice + 1));

		await listingContract.makeOffer(
			"tttttSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			{ from: bob, value: itemPrice + 2, gasPrice: 0 }
		);

		offer = await listingContract.getOfferForBuyerInAuction(
			"tttttSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			bob
		);

		assert.equal(BigInt(offer), BigInt(itemPrice + 2));
	});
});

contract("Listings using third party", function (accounts) {
	it("should not allow buyer to confirm buy in an auction if the seller has accepted a different offer", async () => {
		const alice = accounts[0];
		const bob = accounts[1];
		const charlie = accounts[2];
		const thirdParty = accounts[3];

		const itemPrice = 2;

		const listingContract = await Listings.deployed();

		const thirdPartyBalanceBefore = await web3.eth.getBalance(thirdParty);

		await listingContract.createThirdPartyListing(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			itemPrice,
			true,
			false,
			thirdParty,
			{ from: alice, gasPrice: 0 }
		);

		const thirdPartyFromContract =
			await listingContract.getThirdPartyForListing(
				"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps"
			);
		assert.equal(thirdParty, thirdPartyFromContract);

		await listingContract.makeOffer(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			{ from: bob, value: itemPrice, gasPrice: 0 }
		);

		await listingContract.makeOffer(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			{ from: charlie, value: itemPrice + 1, gasPrice: 0 }
		);

		await listingContract.acceptOffer(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			charlie,
			{ from: alice, gasPrice: 0 }
		);

		const thirdPartyBalanceAfterwards = await web3.eth.getBalance(
			thirdParty
		);

		// funds don't move until buyer confirms
		assert.equal(
			BigInt(thirdPartyBalanceBefore),
			BigInt(thirdPartyBalanceAfterwards)
		);

		let called = false;
		try {
			await listingContract.confirmBuy(
				"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
				{ from: bob, gasPrice: 0 }
			);
		} catch (error) {
			called = true;
			assert(error);
		}

		assert(called);

		await listingContract.confirmBuy(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			{ from: charlie, gasPrice: 0 }
		);

		const thirdPartyBalanceAfterwardsCharlieAccepts =
			await web3.eth.getBalance(thirdParty);

		assert.equal(
			BigInt(thirdPartyBalanceBefore) + BigInt(itemPrice + 1),
			BigInt(thirdPartyBalanceAfterwardsCharlieAccepts)
		);
	});

	it("should refund everyone properly in an auction", async () => {
		const alice = accounts[4];
		const bob = accounts[5];
		const charlie = accounts[6];
		const thirdParty = accounts[7];

		const itemPrice = 2;

		const listingContract = await Listings.deployed();

		const aliceBalanceBefore = await web3.eth.getBalance(alice);
		const bobBalanceBefore = await web3.eth.getBalance(bob);
		const charlieBalanceBefore = await web3.eth.getBalance(charlie);
		const contractBalanceBefore = await web3.eth.getBalance(
			listingContract.address
		);
		const thirdPartyBefore = await web3.eth.getBalance(thirdParty);

		await listingContract.createThirdPartyListing(
			"yyyytSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			itemPrice,
			true,
			false,
			thirdParty,
			{ from: alice, gasPrice: 0 }
		);

		const thirdPartyFromContract =
			await listingContract.getThirdPartyForListing(
				"yyyytSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps"
			);
		assert.equal(thirdParty, thirdPartyFromContract);

		await listingContract.makeOffer(
			"yyyytSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			{ from: bob, value: itemPrice, gasPrice: 0 }
		);

		const bobBalanceAfter = await web3.eth.getBalance(bob);

		assert.equal(
			BigInt(bobBalanceAfter),
			BigInt(bobBalanceBefore) - BigInt(itemPrice)
		);

		const thirdPartyAfterBobsOffer = await web3.eth.getBalance(thirdParty);
		assert.equal(
			BigInt(thirdPartyBefore),
			BigInt(thirdPartyAfterBobsOffer)
		);

		const contractBalanceAfter = await web3.eth.getBalance(
			listingContract.address
		);

		assert.equal(
			BigInt(contractBalanceBefore) + BigInt(itemPrice),
			BigInt(contractBalanceAfter)
		);

		await listingContract.makeOffer(
			"yyyytSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			{ from: charlie, value: itemPrice + 1, gasPrice: 0 }
		);

		const thirdPartyAfterCharliesOffer = await web3.eth.getBalance(
			thirdParty
		);
		assert.equal(
			BigInt(thirdPartyBefore),
			BigInt(thirdPartyAfterCharliesOffer)
		);

		const charlieBalanceAfter = await web3.eth.getBalance(charlie);

		assert.equal(
			BigInt(charlieBalanceAfter),
			BigInt(charlieBalanceBefore) - BigInt(itemPrice + 1)
		);

		const contractBalanceAfterCharlie = await web3.eth.getBalance(
			listingContract.address
		);

		assert.equal(
			BigInt(contractBalanceBefore) +
				BigInt(itemPrice) +
				BigInt(itemPrice + 1),
			BigInt(contractBalanceAfterCharlie)
		);

		await listingContract.acceptOffer(
			"yyyytSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			charlie,
			{ from: alice, gasPrice: 0 }
		);

		const thirdPartyAfterSellerAcceptsCharliesOffer =
			await web3.eth.getBalance(thirdParty);
		assert.equal(
			BigInt(thirdPartyBefore),
			BigInt(thirdPartyAfterSellerAcceptsCharliesOffer)
		);

		assert.equal(
			BigInt(contractBalanceBefore) +
				BigInt(itemPrice) +
				BigInt(itemPrice + 1),
			BigInt(contractBalanceAfterCharlie)
		);

		await listingContract.confirmBuy(
			"yyyytSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			{ from: charlie, gasPrice: 0 }
		);
		const aliceBalanceAfterConfirm = await web3.eth.getBalance(alice);
		const bobBalanceAfterConfirm = await web3.eth.getBalance(bob);
		const charlieBalanceAfterConfirm = await web3.eth.getBalance(charlie);
		const contractBalanceAfterConfirm = await web3.eth.getBalance(
			listingContract.address
		);

		assert.equal(
			BigInt(contractBalanceBefore),
			BigInt(contractBalanceAfterConfirm)
		);
		assert.equal(BigInt(bobBalanceBefore), BigInt(bobBalanceAfterConfirm));
		// alice stays the same as funds are transferred to a third party
		assert.equal(
			BigInt(aliceBalanceBefore),
			BigInt(aliceBalanceAfterConfirm)
		);
		assert.equal(
			BigInt(charlieBalanceBefore) - BigInt(itemPrice + 1),
			BigInt(charlieBalanceAfterConfirm)
		);

		const thirdPartyAfterCharlieConfirms = await web3.eth.getBalance(
			thirdParty
		);
		assert.equal(
			BigInt(thirdPartyBefore) + BigInt(itemPrice + 1),
			BigInt(thirdPartyAfterCharlieConfirms)
		);
	});
});
