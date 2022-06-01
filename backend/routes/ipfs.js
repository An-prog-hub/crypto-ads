var express = require("express");
var router = express.Router();
var { Web3Storage, getFilesFromPath } = require("web3.storage");
var getDb = require("../orbitdb/orbit");
var cache = require("js-cache");

require("dotenv").config();

var listingsCache = new cache();
const cacheTime = 726000000; // two hours

const storage = new Web3Storage({ token: process.env.WEB3STORAGE_TOKEN });
const orbitAuth = process.env.ORBIT_AUTH;

/* Get a listing from web3.storage ipfs */
router.get("/", async function (req, res, next) {
	await retrieveAllFiles(req, res);
});

/* Get a listing from web3.storage ipfs */
router.get("/:cid", async function (req, res, next) {
	await retrieveFilesFromIpfs(req, res);
});

/* Store a new listing in web3.storage ipfs */
router.post("/", async function (req, res, next) {
	await storeFilesInIpfs(req, res);
});

/* Delete a listing from web3.storage ipfs */
router.delete("/:cid", async function (req, res, next) {
	if (!req.headers.authorization) {
		return res.status(403).json({ error: "No credentials sent!" });
	} else {
		if (req.headers.authorization !== orbitAuth) {
			return res.status(403).json({ error: "Wrong password" });
		} else {
			if (!req.params.cid) {
				res.send({
					status: false,
					message: "No CID provided",
				});
			} else {
				await deleteFiles(res, req.params.cid);
				res.send("Record deleted");
			}
		}
	}
});

/* Delete all listings */
router.delete("/all/records", async function (req, res, next) {
	if (!req.headers.authorization) {
		return res.status(403).json({ error: "No credentials sent!" });
	} else {
		if (req.headers.authorization !== orbitAuth) {
			return res.status(403).json({ error: "Wrong password" });
		} else {
			await deleteAll();
			res.send("All records deleted");
		}
	}
});

async function deleteAll() {
	const db = await getDb();
	const allListings = await db.all;
	return await Promise.all(
		Object.keys(allListings).map(async (key) => {
			await deleteWithCid(key);
		})
	);
}

async function storeFilesInIpfs(req, res) {
	try {
		const validatedRequest = validateRequest(req);

		if (!validatedRequest.valid) {
			res.send({
				status: false,
				message: validatedRequest.message,
			});
		} else {
			try {
				const fileData = [];

				const requestFiles = [req.files.listings]
					.flat()
					.map((listing) =>
						Object.assign(listing, {
							name: listing.name.replace(/\s/g, ""),
						})
					);

				const fileNames = requestFiles.map((listing) =>
					// remove white space, and remove leading/trailig slashes
					listing.name.replace(/\s/g, "").replace(/^\/|\/$/g, "")
				);

				for (const file of requestFiles) {
					// move photo to uploads directory
					const path = "./uploads/" + file.name;

					await file.mv(path);

					try {
						const pathFiles = await getFilesFromPath(path);

						fileData.push(...pathFiles);
					} catch (err) {
						console.error(err);
						res.status(500).send(err);
					}
				}

				let cid;
				try {
					// store the image files in ipfs via web3 and save cid
					cid = await storage.put(fileData);
				} catch (err) {
					console.error(err);
					res.status(500).send(err);
				}

				// Add to OrbitDB - using key-value store, where cid is the key
				const db = await getDb();

				try {
					const metadata = {
						price: req.body.price,
						title: req.body.title,
						description: req.body.description,
						location: req.body.location,
						imageFilesCID: cid,
						fileNames,
						user: req.body.user,
						preferences: req.body.preferences,
					};

					// save the listing data in orbitDB using the ipfs image hash as a unique identifier
					await db.put(cid, metadata);

					const listingData = {
						files: fileData,
						metadata,
					};

					// cache the data
					listingsCache.set(cid, listingData, cacheTime);

					res.send(listingData);
				} catch (err) {
					console.error(err);
					res.status(500).send(err);
				}
			} catch (err) {
				console.error(err);
				res.status(500).send(err);
			}
		}
	} catch (err) {
		console.error(err);
		res.status(500).send(err);
	}
}

async function retrieveFilesFromIpfs(req, res) {
	const cid = req.params.cid;

	if (!cid) {
		res.send({
			status: false,
			message: "No CID provided",
		});
	} else {
		try {
			const responseData = await getAndCacheFile(req, cid);
			res.send(responseData);
		} catch (err) {
			console.error(err);
			res.status(500).send(err);
		}
	}
}

const getAndCacheFile = async (req, cid) => {
	const cachedValue = listingsCache.get(cid);
	if (cachedValue) {
		return cachedValue;
	}

	try {
		const result = await storage.get(cid);
		if (!result.ok) {
			throw new Error(`failed to get ${cid}`);
		}

		// unpack File objects from the response
		const files = await result.files();

		// Also send the metadata from OrbitDB
		const db = await getDb();
		const metadata = await db.get(req.params.cid);

		const listingData = {
			files,
			metadata,
		};

		listingsCache.set(cid, listingData, cacheTime);
		return listingData;
	} catch (err) {
		console.error(err);
		res.status(500).send(err);
	}
};

async function retrieveAllFiles(req, res) {
	try {
		const db = await getDb();
		const allListings = await db.all;
		const allListingsArr = [];
		Object.keys(allListings).map((key) =>
			allListingsArr.push(allListings[key])
		);
		res.send(allListingsArr);
	} catch (err) {
		console.error(err);
		res.status(500).send(err);
	}
}

async function deleteFiles(res, cid) {
	try {
		const error = await deleteWithCid(cid);
		if (error) {
			res.status(500).send(error);
		} else {
			res.status(200).send("Record deleted");
		}
	} catch (err) {
		console.error(err);
		res.status(500).send(err);
	}
}

const deleteWithCid = async (cid) => {
	let error;
	// delete from db
	try {
		const db = await getDb();
		await db.del(cid);
	} catch (err) {
		console.error(err);
		error = err;
	}

	// delete from cache
	try {
		await listingsCache.del(cid);
	} catch (err) {
		console.error(err);
		error = err;
	}

	// delete from ipfs
	try {
		// delete isn't implemented in storage yet
		// await storage.delete(cid);
	} catch (err) {
		console.error(err);
		error = err;
	}

	return error;
};

const validateRequest = (req) => {
	const validated = {
		valid: false,
		message: "",
	};
	if (!req.body) {
		validated.message = "No body provided";
		return validated;
	}

	if (!req.files || !req.files.listings) {
		validated.message = "No file uploaded";
		return validated;
	}

	if (!req.body.price) {
		validated.message = "No price provided";
		return validated;
	}

	if (!req.body.title) {
		validated.message = "No title provided";
		return validated;
	}

	if (!req.body.description) {
		validated.message = "No description uploaded";
		return validated;
	}

	try {
		if (!JSON.parse(req.body.location)) {
			validated.message = "No listing preferences provided";
			return validated;
		}
	} catch (err) {
		validated.message = "Location couldn't be decoded";
		return validated;
	}

	if (!req.body.user) {
		validated.message = "No user provided";
		return validated;
	}

	if (!req.body.preferences) {
		validated.message = "No listing preferences provided";
		return validated;
	}

	try {
		if (!JSON.parse(req.body.preferences)) {
			validated.message = "No listing preferences provided";
			return validated;
		}
	} catch (err) {
		validated.message = "Listing preferences couldn't be decoded";
		return validated;
	}

	return {
		valid: true,
	};
};

module.exports = router;
