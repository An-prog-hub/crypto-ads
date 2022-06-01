const IPFS = require("ipfs");
const OrbitDB = require("orbit-db");
const fs = require("fs");

// This just needs to be run once to create the DB locally
// Otherwise we connect to an existing one
async function main() {
	// Create IPFS instance
	const ipfsOptions = { repo: "./ipfs" };
	const ipfs = await IPFS.create(ipfsOptions);

	// Create OrbitDB instance
	const orbitdb = await OrbitDB.createInstance(ipfs);

	// Create database instance
	const options = {
		accessController: {
			write: [
				// Give access to ourselves
				orbitdb.identity.id,
			],
		},
	};
	const db = await orbitdb.keyvalue("listings-database", options);
	fs.writeFileSync(
		"creds.json",
		JSON.stringify({ address: db.address.toString() })
	);
	process.env.ORBIT_DB_ADDRESS = db.address.toString();
	process.exit();
}

main();
