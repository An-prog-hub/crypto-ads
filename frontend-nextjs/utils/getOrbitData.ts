import axios from "axios";

const orbitURL: string = process.env.NEXT_PUBLIC_API_ADDRESS as string;

export const getListing = async (listingCID: string) => {
	try {
		return await axios({
			method: "get",
			url: orbitURL + listingCID,
		});
	} catch (err) {
		console.error("(OrbitDB) Couldn't getListing data from orbit: ", err);
		throw Error("Couldn't getListing data from orbit")
	}
};

export const getAllListings = async () => {
	try {
		return await axios({
			method: "get",
			url: orbitURL,
		});
	} catch (err) {
		console.error("(OrbitDB) Couldn't getAllListing data from orbit: ", err);
		throw Error("Couldn't getAllListing data from orbit")
	}
};

export type IpfsHash = string;
export type OrbitId = string;

export type Listing = {
	price: string;
	title: string;
	description: string;
	imageFilesCID: string;
	offersMade: String[];
};

export type OrbitListing = {
	files: Array<File>;
	metadata: {
		description: string;
		fileNames: Array<string>;
		imageFilesCID: string;
		location: string;
		preferences: string;
		price: string;
		title: string;
		user: string;
	};
};

export type LocationData = {
	country: string;
	streetAddress: string;
	city: string;
	state: string;
	postcode: string;
}

export type ListingPreferences = {
	auction: boolean;
		saveIpfsData: boolean;
		useThirdParty: boolean;
}
export type ListingFormData = {
	selectedFiles: Array<File>;
	title: string;
	description: string;
	price: string;
	location: LocationData;
	preferences: ListingPreferences;
	user: string;
}

export const createListing = async (listing: ListingFormData): Promise<OrbitListing> => {
	var formData = new FormData();
	listing.selectedFiles.forEach(file => file.name.trim() && formData.append("listings", file))
	formData.append("title", listing.title);
	formData.append("price", listing.price);
	formData.append("description", listing.description);
	formData.append("location", JSON.stringify(listing.location));
	formData.append("user", listing.user);
	formData.append("preferences", JSON.stringify(listing.preferences));

	try {
		const orbitData = await axios.post(
			orbitURL,
			formData,
			{
				headers: {
					"Content-Type": "multipart/form-data",
				},
			}
		);

		return orbitData.data;
	} catch (err) {
		console.error("(OrbitDB) Couldn't create listing in orbit data from orbit: ", err);
		throw Error("Couldn't save data to orbit");
	}
};

export const deleteListing = async (listingCID: string): Promise<any> => {
	try {
		return await axios({
			method: "delete",
			url: orbitURL + listingCID,
		});
	} catch (err) {
		console.error("(OrbitDB) Couldn't getListing data from orbit: ", err);
		throw Error("Couldn't delete data from orbit")
	}
}
