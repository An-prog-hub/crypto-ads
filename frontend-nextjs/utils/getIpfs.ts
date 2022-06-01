/**
 * Return an IPFS gateway URL for the given CID and path
 * @param {string} cid
 * @param {string} path
 * @returns {string}
 */
 export function makeGatewayURL(cid: string, path: string) {
	return `https://${cid}.ipfs.dweb.link/${encodeURIComponent(path)}`;
}
