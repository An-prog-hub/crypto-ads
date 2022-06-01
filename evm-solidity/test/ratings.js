const Listings = artifacts.require("Listings");
const Ratings = artifacts.require("Ratings");
const Barrio = artifacts.require("Barrio");

contract("Ratings.leaveRating", function (accounts) {
	it("leaveRating should not allow a seller to leave a rating if the buy isn't confirmed", async () => {
		const alice = accounts[0];
		const bob = accounts[1];
		const thirdParty = accounts[2];

		const itemPrice = 2;

		const listingContract = await Listings.deployed();
		const ratingContract = await Ratings.deployed();
		const barrioContract = await Barrio.deployed();

		let called = false;
		try {
			await ratingContract.leaveSellerRating(
				"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTjjjjj",
				4,
				{ from: bob, gasPrice: 0 }
			);
		} catch (error) {
			called = true;
			assert(error);
		}

		assert(called);

		await listingContract.createThirdPartyListing(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTjjjjj",
			itemPrice,
			true,
			false,
			thirdParty,
			{ from: alice, gasPrice: 0 }
		);

		called = false;
		try {
			await ratingContract.leaveSellerRating(
				"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTjjjjj",
				4,
				{ from: bob, gasPrice: 0 }
			);
		} catch (error) {
			called = true;
			assert(error);
		}

		assert(called);

		await listingContract.makeOffer(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTjjjjj",
			{ from: bob, value: itemPrice, gasPrice: 0 }
		);

		called = false;
		try {
			await ratingContract.leaveSellerRating(
				"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTjjjjj",
				4,
				{ from: bob, gasPrice: 0 }
			);
		} catch (error) {
			called = true;
			assert(error);
		}

		assert(called);

		await listingContract.acceptOffer(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTjjjjj",
			bob,
			{ from: alice, gasPrice: 0 }
		);

		called = false;
		try {
			await ratingContract.leaveSellerRating(
				"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTjjjjj",
				4,
				{ from: bob, gasPrice: 0 }
			);
		} catch (error) {
			called = true;
			assert(error);
		}

		assert(called);
	});

	it("leaveRating should allow buyers and sellers to leave rating in non-auction when the purchase is confirmed", async () => {
		const alice = accounts[3];
		const bob = accounts[4];

		const itemPrice = 2;

		const listingContract = await Listings.deployed();
		const ratingContract = await Ratings.deployed();
		const barrioContract = await Barrio.deployed();

		await listingContract.createListing(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTwwwww",
			itemPrice,
			false,
			false,
			{ from: alice, gasPrice: 0 }
		);

		await listingContract.makeOffer(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTwwwww",
			{ from: bob, value: itemPrice, gasPrice: 0 }
		);

		let called = false;
		try {
			await ratingContract.leaveSellerRating(
				"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTwwwww",
				4,
				{ from: bob, gasPrice: 0 }
			);
		} catch (error) {
			called = true;
			assert(error);
		}

		assert(called);

		await listingContract.confirmBuy(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTwwwww",
			{ from: bob, gasPrice: 0 }
		);

		await ratingContract.leaveSellerRating(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTwwwww",
			4,
			{ from: bob, gasPrice: 0 }
		);

		const allRatings = await ratingContract.getSellerRatings(alice, {
			from: bob,
			gasPrice: 0,
		});

		assert.equal(BigInt(allRatings[0]), BigInt(4));

		// the seller can now rate the buyer

		// cant leave a negative rating
		called = false;
		try {
			await ratingContract.leaveBuyerRating(
				"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTwwwww",
				-1,
				{ from: alice, gasPrice: 0 }
			);
		} catch (error) {
			called = true;
			assert(error);
		}

		assert(called);

		// cant leave a rating greater than 5
		called = false;
		try {
			await ratingContract.leaveBuyerRating(
				"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTwwwww",
				6,
				{ from: alice, gasPrice: 0 }
			);
		} catch (error) {
			called = true;
			assert(error);
		}

		assert(called);

		await ratingContract.leaveBuyerRating(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTwwwww",
			4,
			{ from: alice, gasPrice: 0 }
		);

		const allBuyerRatings = await ratingContract.getBuyerRatings(bob, {
			from: bob,
			gasPrice: 0,
		});
		assert.equal(BigInt(allBuyerRatings[0]), BigInt(4));

		// you can't leave another rating
		called = false;
		try {
			await ratingContract.leaveBuyerRating(
				"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTwwwww",
				5,
				{ from: bob, gasPrice: 0 }
			);
		} catch (error) {
			called = true;
			assert(error);
		}

		assert(called);
	});

	it("leaveRating should allow a confirmed buyer to leave a rating of a third party", async () => {
		const alice = accounts[5];
		const bob = accounts[6];
		const thirdParty = accounts[7];

		const itemPrice = 2;

		const listingContract = await Listings.deployed();
		const ratingContract = await Ratings.deployed();
		const barrioContract = await Barrio.deployed();

		await listingContract.createThirdPartyListing(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			itemPrice,
			true,
			false,
			thirdParty,
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

		let called = false;
		try {
			await ratingContract.leaveSellerRating(
				"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
				4,
				{ from: bob, gasPrice: 0 }
			);
		} catch (error) {
			called = true;
			assert(error);
		}

		assert(called);

		await listingContract.confirmBuy(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			{ from: bob, gasPrice: 0 }
		);

		// cant leave a negative rating
		called = false;
		try {
			await ratingContract.leaveSellerRating(
				"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
				-1,
				{ from: bob, gasPrice: 0 }
			);
		} catch (error) {
			called = true;
			assert(error);
		}

		assert(called);

		// cant leave a rating greater than 5
		called = false;
		try {
			await ratingContract.leaveSellerRating(
				"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
				6,
				{ from: bob, gasPrice: 0 }
			);
		} catch (error) {
			called = true;
			assert(error);
		}

		assert(called);

		await ratingContract.leaveSellerRating(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			4,
			{ from: bob, gasPrice: 0 }
		);

		const allRatings = await ratingContract.getSellerRatings(thirdParty, {
			from: bob,
			gasPrice: 0,
		});

		assert.equal(BigInt(allRatings[0]), BigInt(4));

		// you can't leave another rating
		called = false;
		try {
			await ratingContract.leaveSellerRating(
				"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
				5,
				{ from: bob, gasPrice: 0 }
			);
		} catch (error) {
			called = true;
			assert(error);
		}

		assert(called);

		// the seller can now rate the buyer

		// cant leave a negative rating
		called = false;
		try {
			await ratingContract.leaveBuyerRating(
				"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
				-1,
				{ from: alice, gasPrice: 0 }
			);
		} catch (error) {
			called = true;
			assert(error);
		}

		assert(called);

		// cant leave a rating greater than 5
		called = false;
		try {
			await ratingContract.leaveBuyerRating(
				"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
				6,
				{ from: alice, gasPrice: 0 }
			);
		} catch (error) {
			called = true;
			assert(error);
		}

		assert(called);

		await ratingContract.leaveBuyerRating(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
			4,
			{ from: alice, gasPrice: 0 }
		);

		const allBuyerRatings = await ratingContract.getBuyerRatings(bob, {
			from: bob,
			gasPrice: 0,
		});
		assert.equal(BigInt(allBuyerRatings[0]), BigInt(4));

		// you can't leave another rating
		called = false;
		try {
			await ratingContract.leaveBuyerRating(
				"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTaKGps",
				5,
				{ from: bob, gasPrice: 0 }
			);
		} catch (error) {
			called = true;
			assert(error);
		}

		assert(called);
	});
});

contract("Ratings.leaveRating", function (accounts) {
	it("returns an empty array when there are no ratings", async () => {
		const alice = accounts[0];

		const ratingContract = await Ratings.deployed();
		const barrioContract = await Barrio.deployed();

		const allBuyerRatings = await ratingContract.getBuyerRatings(alice, {
			from: alice,
			gasPrice: 0,
		});
		assert.equal(BigInt(allBuyerRatings), []);
	});

	it("returns true in an auction for sellerRatingAvailable and buyerRatingAvailable until the seller and buyer has rated", async () => {
		const alice = accounts[1];
		const bob = accounts[2];

		const itemPrice = 2;

		const listingContract = await Listings.deployed();
		const ratingContract = await Ratings.deployed();
		const barrioContract = await Barrio.deployed();

		let buyerCanRate = await ratingContract.sellerRatingAvailable(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTvvvvv",
			{ from: alice, gasPrice: 0 }
		);
		let sellerCanRate = await ratingContract.buyerRatingAvailable(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTvvvvv",
			{ from: alice, gasPrice: 0 }
		);
		assert(!sellerCanRate);
		assert(!buyerCanRate);

		await listingContract.createListing(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTvvvvv",
			itemPrice,
			true,
			false,
			{ from: alice, gasPrice: 0 }
		);

		buyerCanRate = await ratingContract.sellerRatingAvailable(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTvvvvv",
			{ from: alice, gasPrice: 0 }
		);
		sellerCanRate = await ratingContract.buyerRatingAvailable(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTvvvvv",
			{ from: alice, gasPrice: 0 }
		);
		assert(!sellerCanRate);
		assert(!buyerCanRate);

		await listingContract.makeOffer(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTvvvvv",
			{ from: bob, value: itemPrice, gasPrice: 0 }
		);

		buyerCanRate = await ratingContract.sellerRatingAvailable(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTvvvvv",
			{ from: alice, gasPrice: 0 }
		);
		sellerCanRate = await ratingContract.buyerRatingAvailable(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTvvvvv",
			{ from: alice, gasPrice: 0 }
		);
		assert(!sellerCanRate);
		assert(!buyerCanRate);

		await listingContract.acceptOffer(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTvvvvv",
			bob,
			{ from: alice, gasPrice: 0 }
		);

		buyerCanRate = await ratingContract.sellerRatingAvailable(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTvvvvv",
			{ from: alice, gasPrice: 0 }
		);
		sellerCanRate = await ratingContract.buyerRatingAvailable(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTvvvvv",
			{ from: alice, gasPrice: 0 }
		);
		assert(!sellerCanRate);
		assert(!buyerCanRate);

		await listingContract.confirmBuy(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTvvvvv",
			{ from: bob, gasPrice: 0 }
		);

		buyerCanRate = await ratingContract.sellerRatingAvailable(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTvvvvv",
			{ from: alice, gasPrice: 0 }
		);
		sellerCanRate = await ratingContract.buyerRatingAvailable(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTvvvvv",
			{ from: alice, gasPrice: 0 }
		);
		assert(sellerCanRate);
		assert(buyerCanRate);

		// after they leave a rating then they can't rate again
		await ratingContract.leaveBuyerRating(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTvvvvv",
			3,
			{ from: alice, gasPrice: 0 }
		);
		await ratingContract.leaveSellerRating(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTvvvvv",
			3,
			{ from: bob, gasPrice: 0 }
		);

		buyerCanRate = await ratingContract.sellerRatingAvailable(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTvvvvv",
			{ from: alice, gasPrice: 0 }
		);
		sellerCanRate = await ratingContract.buyerRatingAvailable(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTvvvvv",
			{ from: alice, gasPrice: 0 }
		);
		assert(!sellerCanRate);
		assert(!buyerCanRate);
	});

	it("returns true in an standard listing for sellerRatingAvailable and buyerRatingAvailable until the seller and buyer has rated", async () => {
		const alice = accounts[1];
		const bob = accounts[2];

		const itemPrice = 2;

		const listingContract = await Listings.deployed();
		const ratingContract = await Ratings.deployed();
		const barrioContract = await Barrio.deployed();

		let buyerCanRate = await ratingContract.sellerRatingAvailable(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTbbbbb",
			{ from: alice, gasPrice: 0 }
		);
		let sellerCanRate = await ratingContract.buyerRatingAvailable(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTbbbbb",
			{ from: alice, gasPrice: 0 }
		);
		assert(!sellerCanRate);
		assert(!buyerCanRate);

		await listingContract.createListing(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTbbbbb",
			itemPrice,
			false,
			false,
			{ from: alice, gasPrice: 0 }
		);

		buyerCanRate = await ratingContract.sellerRatingAvailable(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTbbbbb",
			{ from: alice, gasPrice: 0 }
		);
		sellerCanRate = await ratingContract.buyerRatingAvailable(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTbbbbb",
			{ from: alice, gasPrice: 0 }
		);
		assert(!sellerCanRate);
		assert(!buyerCanRate);

		await listingContract.makeOffer(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTbbbbb",
			{ from: bob, value: itemPrice, gasPrice: 0 }
		);

		buyerCanRate = await ratingContract.sellerRatingAvailable(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTbbbbb",
			{ from: alice, gasPrice: 0 }
		);
		sellerCanRate = await ratingContract.buyerRatingAvailable(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTbbbbb",
			{ from: alice, gasPrice: 0 }
		);
		assert(!sellerCanRate);
		assert(!buyerCanRate);

		await listingContract.confirmBuy(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTbbbbb",
			{ from: bob, gasPrice: 0 }
		);

		buyerCanRate = await ratingContract.sellerRatingAvailable(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTbbbbb",
			{ from: alice, gasPrice: 0 }
		);
		sellerCanRate = await ratingContract.buyerRatingAvailable(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTbbbbb",
			{ from: alice, gasPrice: 0 }
		);
		assert(sellerCanRate);
		assert(buyerCanRate);

		// after they leave a rating then they can't rate again
		await ratingContract.leaveBuyerRating(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTbbbbb",
			3,
			{ from: alice, gasPrice: 0 }
		);
		await ratingContract.leaveSellerRating(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTbbbbb",
			3,
			{ from: bob, gasPrice: 0 }
		);

		buyerCanRate = await ratingContract.sellerRatingAvailable(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTbbbbb",
			{ from: alice, gasPrice: 0 }
		);
		sellerCanRate = await ratingContract.buyerRatingAvailable(
			"QmV9tSDx9UiPeWExXEeH6aoDvmihvx6jD5eLb4jbTbbbbb",
			{ from: alice, gasPrice: 0 }
		);
		assert(!sellerCanRate);
		assert(!buyerCanRate);
	});
});
