const Listings = artifacts.require("Listings");
const Ratings = artifacts.require("Ratings");
const Barrio = artifacts.require("Barrio");

module.exports = async function (deployer) {
	const listing = await deployer.deploy(Listings).then(() => {});
	const barrio = await deployer.deploy(Barrio, 1000);

	await deployer.deploy(Ratings, Listings.address, Barrio.address);

	barrio.setRatingsContractAddress(Ratings.address);
};
