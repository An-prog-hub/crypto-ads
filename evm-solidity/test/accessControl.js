const Listings = artifacts.require("Listings");

contract("Access Control", function (accounts) {
	const owner = accounts[0];
	const alice = accounts[1];
	const bob = accounts[2];

	beforeEach(async () => {
		listings = await Listings.new();
	});

	it("should be able to set the CEO on payment pipe", async () => {
		await listings.setCEO(accounts[2], { from: owner });
		assert.equal(await listings.ceoAddress(), accounts[2]);
	});

	it("should be able to set the COO on payment pipe", async () => {
		await listings.setCOO(accounts[3], { from: owner });
		assert.equal(await listings.cooAddress(), accounts[3]);
	});

	it("should be able to set the CFO on payment pipe", async () => {
		await listings.setCFO(accounts[4], { from: owner });
		assert.equal(await listings.cfoAddress(), accounts[4]);
	});

	it("any c level account should be able to pause the contract", async () => {
		await listings.setCEO(accounts[1], { from: owner });
		await listings.setCOO(accounts[2], { from: accounts[1] });
		await listings.setCFO(accounts[3], { from: accounts[1] });
		assert.equal(await listings.paused(), false);

		// the CEO should be able to pause
		await listings.pause({ from: accounts[1] });
		assert.equal(await listings.paused(), true);
		await listings.unpause({ from: accounts[1] });
		assert.equal(await listings.paused(), false);

		// the COO should be able to pause
		await listings.pause({ from: accounts[2] });
		assert.equal(await listings.paused(), true);
		await listings.unpause({ from: accounts[1] });
		assert.equal(await listings.paused(), false);

		// the CFO should be able to pause
		await listings.pause({ from: accounts[3] });
		assert.equal(await listings.paused(), true);
		await listings.unpause({ from: accounts[1] });
		assert.equal(await listings.paused(), false);
	});

	it("only CEO can unpause the contract", async () => {
		await listings.setCEO(accounts[1], { from: owner });
		await listings.setCOO(accounts[2], { from: accounts[1] });
		await listings.setCFO(accounts[3], { from: accounts[1] });
		assert.equal(await listings.paused(), false);

		// the COO should not be able to pause
		await listings.pause({ from: accounts[2] });
		assert.equal(await listings.paused(), true);

		try {
			await listings.unpause({ from: accounts[2] });
		} catch (e) {
			// catches that the VM rejected
		}
		assert.equal(await listings.paused(), true);

		await listings.unpause({ from: accounts[1] });
		assert.equal(await listings.paused(), false);

		// the COO should not be able to pause
		await listings.pause({ from: accounts[3] });
		assert.equal(await listings.paused(), true);
		try {
			await listings.unpause({ from: accounts[3] });
		} catch (e) {
			// catches that the VM rejected
		}
		assert.equal(await listings.paused(), true);
	});
});
