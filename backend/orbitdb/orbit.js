const IPFS = require("ipfs");
const OrbitDB = require("orbit-db");
const fs = require("fs");

const creds = fs.readFileSync("creds.json");

// Uses a singleton pattern to construct, load and get database
class DatabaseConnection {
	database;

	constructor() {
		// Create a singleton for DB creation
		if (DatabaseConnection._instance) {
			return DatabaseConnection._instance;
		}
		DatabaseConnection._instance = this;
		this.init();
	}

	async init() {
		if (this.database) return this.database;

		// Create IPFS instance
		const ipfsOptions = { repo: "./ipfs" };
		const ipfs = await IPFS.create(ipfsOptions);

		// Create OrbitDB instance
		const orbitdb = await OrbitDB.createInstance(ipfs);

		// Connect to a DB instance
		console.log("Connecting...", JSON.parse(creds.toString()).address);
		const db = await orbitdb.open(JSON.parse(creds.toString()).address);

		await db.load();

		this.database = db;
	}

	async getDb() {
		return new Promise((resolve, reject) => {
			let counter = 0;

			const checkDB = () => {
				if (this.database) {
					resolve(this.database);
				} else {
					setTimeout(() => {
						console.log(counter);
						if (counter > 10) {
							reject("Connection to ipfs timed out");
						} else {
							counter++;
							checkDB();
						}
					}, 5000);
				}
			};

			checkDB();
		});
	}
}

const connection = new DatabaseConnection();

const getDb = async () => {
	return await connection.getDb();
};

module.exports = getDb;
