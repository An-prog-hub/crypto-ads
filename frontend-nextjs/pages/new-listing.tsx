import { PaperClipIcon } from "@heroicons/react/solid";
import Link from "next/link";
import { FormEvent, useContext, useState } from "react";
import ErrorAlert from "../components/ErrorAlert";
import LoadingSpinner from "../components/LoadingSpinner";
import SuccessAlert from "../components/SuccessAlert";
import { ListingsContext } from "../context/listings";
import {
	createListing,
	deleteListing,
	OrbitListing,
} from "../utils/getOrbitData";
import getWeb3 from "../utils/getWeb3";

export default function NewListing() {
	// listing context to update on success
	const { getAllProducts } = useContext<any>(ListingsContext);

	// form data
	const [title, setTitle] = useState("");
	const [description, setDescription] = useState("");
	// location data
	const [country, setCountry] = useState("United States");
	const [streetAddress, setStreetAddress] = useState("");
	const [city, setCity] = useState("");
	const [state, setState] = useState("");
	const [postcode, setPostcode] = useState("");

	// preferences
	const [auction, setAuction] = useState(false);
	const [saveIpfsData, setSaveIpfsData] = useState(false);
	const [useThirdParty, setUseThirdParty] = useState(false);
	const [thirdPartyEthAddress, setThirdPartyEthAddress] = useState("");

	const [price, setPrice] = useState("0");
	const [selectedFiles, setSelectedFiles] = useState<Array<File>>([]);

	const [loading, setLoading] = useState(false);

	// errors
	const [showError, setShowError] = useState(false);
	const [error, setError] = useState({
		title: "Unknown Error Occurred",
		message: "Sorry about that...",
	});

	// successAlert
	const [showAlert, setShowAlert] = useState(false);
	const [alert, setAlert] = useState({
		title: "Wow something happened!",
		message: "Congrats",
	});
	const [newListingCid, setNewListingCid] = useState("");

	const save = async (e: FormEvent) => {
		setLoading(true);
		e.preventDefault();
		let user;
		try {
			user = await getWeb3.getAccounts();
		} catch (e) {
			setError({
				title: "Metamask disconnected",
				message: "You need to enable metamask in order to post an ad",
			});
			setShowError(true);
			setLoading(false);

			return;
		}

		const formData = {
			title,
			description,
			location: {
				country,
				streetAddress,
				city,
				state,
				postcode,
			},
			price,
			selectedFiles,
			preferences: {
				auction,
				saveIpfsData,
				useThirdParty,
				thirdPartyEthAddress,
			},
			user,
		};
		let listing: OrbitListing;
		// save data to IPFS and OrbitDB
		try {
			listing = await createListing(formData);
		} catch (e) {
			setError({
				title: "Unable to list item",
				message:
					"Sorry, we haven't been able to succesfully list your item. Please check the data you've entered and try again later.",
			});
			setShowError(true);
			setLoading(false);
			return;
		}
		// send the ipfs hash to smart contract
		try {
			if (useThirdParty) {
				await getWeb3.createThirdPartyListing(
					listing.metadata.imageFilesCID,
					thirdPartyEthAddress,
					price,
					auction,
					false
				);
			} else {
				await getWeb3.createListing(
					listing.metadata.imageFilesCID,
					price,
					auction,
					false
				);
			}
		} catch (e) {
			try {
				// if the smart contract fails let's clear up some data
				deleteListing(listing.metadata.imageFilesCID);
			} catch (e) {}
			setError({
				title: "Smart contract failed",
				message:
					"Sorry, the EVM listing creation was rejected. This can happen because the image you uploaded into already has a listing associated with it. Try your listing again with a different image.",
			});
			setShowError(true);
			setLoading(false);
			return;
		}
		await getAllProducts();

		setNewListingCid(listing.metadata.imageFilesCID);

		setAlert({
			title: "Listing created!",
			message:
				"You're listing was succesfully created. We'll notify you once you receive some offers!",
		});
		setShowAlert(true);
		setLoading(false);
	};

	const removeSelectedFiles = (e: FormEvent, file: File) => {
		e.preventDefault();
		setSelectedFiles(
			selectedFiles.filter(
				(uploadedFile) => uploadedFile.name != file.name
			)
		);
	};

	return (
		<div className="max-w-7xl mx-auto pt-20 pb-20 px-4 sm:px-6 lg:px-8">
			<div className="max-w-3xl mx-auto">
				{loading ? (
					<div>
						<LoadingSpinner />

						<div className="flex justify-center items-center m-auto p-10">
							<div className="space-y-8 divide-y divide-gray-200">
								<h3 className="text-center text-lg leading-6 font-medium text-gray-900">
									Uploading Listing
								</h3>
								<p className="text-center mt-1 text-sm text-gray-500">
									We&rsquo;re uploading your listing data to
									IPFS. Once it&rsquo;s uploaded you&rsquo;ll
									need to confirm the transaction in metamask
									to list your item for sale on the
									blockchain. We&rsquo;ll let you know when
									your item is ready to view!
								</p>
							</div>
						</div>
					</div>
				) : (
					<form className="space-y-8 divide-y divide-gray-200">
						<div className="space-y-8 divide-y divide-gray-200">
							<div>
								<div>
									<h3 className="text-lg leading-6 font-medium text-gray-900">
										Post an ad
									</h3>
									<p className="mt-1 text-sm text-gray-500">
										Tell others about what you are selling.
									</p>
								</div>

								<div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
									<div className="sm:col-span-4">
										<div className="sm:col-span-3">
											<label
												htmlFor="first-name"
												className="block text-sm font-medium text-gray-700"
											>
												Title
											</label>
											<div className="mt-1">
												<input
													type="text"
													name="title"
													id="title"
													placeholder="Add a title to your add"
													autoComplete="title"
													value={title}
													onChange={(e) =>
														setTitle(e.target.value)
													}
													className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
												/>
											</div>
										</div>
									</div>

									<div className="mt-5 sm:flex sm:items-center sm:col-span-6">
										<div>
											<label
												htmlFor="price"
												className="block text-sm font-medium text-gray-700"
											>
												Price
											</label>
											<div className="mt-1 relative rounded-md shadow-sm">
												<input
													type="text"
													name="price"
													id="price"
													className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-4 pr-12 sm:text-sm border-gray-300 rounded-md"
													placeholder="0.00"
													value={price}
													onChange={(e) =>
														setPrice(e.target.value)
													}
												/>
												<div className="absolute inset-y-0 right-0 flex items-center">
													<label
														htmlFor="currency"
														className="sr-only"
													>
														Currency
													</label>
													<select
														id="currency"
														name="currency"
														className="focus:ring-indigo-500 focus:border-indigo-500 h-full py-0 pl-2 pr-7 border-transparent bg-transparent text-gray-500 sm:text-sm rounded-md"
													>
														<option>ETH</option>
														{/* <option>USD</option>
														<option>EUR</option> */}
													</select>
												</div>
											</div>
										</div>
									</div>

									<div className="sm:col-span-6">
										<label
											htmlFor="about"
											className="block text-sm font-medium text-gray-700"
										>
											Description
										</label>
										<div className="mt-1">
											<textarea
												id="about"
												name="about"
												rows={4}
												className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border border-gray-300 rounded-md"
												value={description}
												onChange={(e) =>
													setDescription(
														e.target.value
													)
												}
											/>
										</div>
										<p className="mt-2 text-sm text-gray-500">
											Write a few sentences about the item
											you are selling and what condition
											it is in.
										</p>
									</div>

									<div className="sm:col-span-6">
										<label
											htmlFor="cover-photo"
											className="block text-sm font-medium text-gray-700"
										>
											Photos
										</label>
										<ul role="list">
											{selectedFiles?.map((file) => {
												return (
													<li
														className="pl-3 pr-4 py-3 flex items-center justify-between text-sm"
														key={file.name}
													>
														<div className="w-0 flex-1 flex items-center">
															<PaperClipIcon
																className="flex-shrink-0 h-5 w-5 text-gray-400"
																aria-hidden="true"
															/>
															<span className="ml-2 flex-1 w-0 truncate">
																{file.name}
															</span>
														</div>
														<div className="ml-4 flex-shrink-0">
															<button
																className="font-medium text-indigo-600 hover:text-indigo-500"
																onClick={(e) =>
																	removeSelectedFiles(
																		e,
																		file
																	)
																}
															>
																Remove
															</button>
														</div>
													</li>
												);
											})}
										</ul>
										<div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
											<div className="space-y-1 text-center">
												<svg
													className="mx-auto h-12 w-12 text-gray-400"
													stroke="currentColor"
													fill="none"
													viewBox="0 0 48 48"
													aria-hidden="true"
												>
													<path
														d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
														strokeWidth={2}
														strokeLinecap="round"
														strokeLinejoin="round"
													/>
												</svg>
												<div className="flex text-sm text-gray-600">
													<label
														htmlFor="file-upload"
														className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
													>
														<span>
															Upload a file
														</span>
														<input
															id="file-upload"
															name="file-upload"
															type="file"
															className="sr-only"
															onChange={(e) =>
																setSelectedFiles(
																	selectedFiles.concat(
																		(
																			e as any
																		).target
																			.files[0]
																	)
																)
															}
														/>
													</label>
													<p className="pl-1">
														or drag and drop
													</p>
												</div>
												<p className="text-xs text-gray-500">
													PNG, JPG, GIF up to 10MB
												</p>
											</div>
										</div>
										<p className="mt-2 text-sm text-gray-500">
											Share some photos of the item.
										</p>
									</div>
								</div>

								<div className="pt-8">
									<div>
										<h3 className="text-lg leading-6 font-medium text-gray-900">
											Location
										</h3>
										<p className="mt-1 text-sm text-gray-500">
											Let people know where you&rsquo;re
											selling the item. You&rsquo;ll need
											to meet up in person to finalize the
											exchange.
										</p>
									</div>
									<div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
										<div className="sm:col-span-4">
											<div className="sm:col-span-3">
												<label
													htmlFor="country-name"
													className="block text-sm font-medium text-gray-700"
												>
													Country
												</label>
												<div className="mt-1">
													<input
														type="text"
														name="country"
														id="country"
														autoComplete="country-name"
														value={country}
														onChange={(e) =>
															setCountry(
																e.target.value
															)
														}
														className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
													/>
												</div>
											</div>
										</div>

										{/* <div className="sm:col-span-3">
											<label
												htmlFor="country"
												className="block text-sm font-medium text-gray-700"
											>
												Country
											</label>
											<div className="mt-1">
												<select
													id="country"
													name="country"
													autoComplete="country-name"
													className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
													onChange={(e) =>
														setCountry(
															e.target.value
														)
													}
												>
													<option>
														United States
													</option>
													<option>Canada</option>
													<option>Mexico</option>
												</select>
											</div>
										</div> */}

										<div className="sm:col-span-6">
											<label
												htmlFor="street-address"
												className="block text-sm font-medium text-gray-700"
											>
												Street address
											</label>
											<div className="mt-1">
												<input
													type="text"
													name="street-address"
													id="street-address"
													autoComplete="street-address"
													className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
													value={streetAddress}
													onChange={(e) =>
														setStreetAddress(
															e.target.value
														)
													}
												/>
											</div>
										</div>

										<div className="sm:col-span-2">
											<label
												htmlFor="city"
												className="block text-sm font-medium text-gray-700"
											>
												City
											</label>
											<div className="mt-1">
												<input
													type="text"
													name="city"
													id="city"
													autoComplete="address-level2"
													className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
													value={city}
													onChange={(e) =>
														setCity(e.target.value)
													}
												/>
											</div>
										</div>

										<div className="sm:col-span-2">
											<label
												htmlFor="region"
												className="block text-sm font-medium text-gray-700"
											>
												State / Province
											</label>
											<div className="mt-1">
												<input
													type="text"
													name="region"
													id="region"
													autoComplete="address-level1"
													className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
													value={state}
													onChange={(e) =>
														setState(e.target.value)
													}
												/>
											</div>
										</div>

										<div className="sm:col-span-2">
											<label
												htmlFor="postal-code"
												className="block text-sm font-medium text-gray-700"
											>
												ZIP / Postal code
											</label>
											<div className="mt-1">
												<input
													type="text"
													name="postal-code"
													id="postal-code"
													autoComplete="postal-code"
													className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
													value={postcode}
													onChange={(e) =>
														setPostcode(
															e.target.value
														)
													}
												/>
											</div>
										</div>
									</div>
								</div>
							</div>

							<div className="pt-8">
								<div>
									<h3 className="text-lg leading-6 font-medium text-gray-900">
										Ad Preferences
									</h3>
									<p className="mt-1 text-sm text-gray-500">
										Decide whether you&rsquo;d like to
										configure more advanced options for your
										listing.
									</p>
								</div>
								<div className="mt-6">
									<fieldset>
										<div className="mt-4 space-y-4">
											<div className="relative flex items-start">
												<div className="flex items-center h-5">
													<input
														id="auction"
														name="auction"
														type="checkbox"
														className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
														onChange={(e) =>
															setAuction(!auction)
														}
													/>
												</div>
												<div className="ml-3 text-sm">
													<label
														htmlFor="auction"
														className="font-medium text-gray-700"
													>
														Auction
													</label>
													<p className="text-gray-500">
														If the price listed is a
														minimum price, you can
														allow people to offer
														more
													</p>
												</div>
											</div>
											{/* <div className="relative flex items-start">
												<div className="flex items-center h-5">
													<input
														id="ipfs"
														name="ipfs"
														type="checkbox"
														className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
														onChange={(e) =>
															setSaveIpfsData(
																!saveIpfsData
															)
														}
													/>
												</div>
												<div className="ml-3 text-sm">
													<label
														htmlFor="ipfs"
														className="font-medium text-gray-700"
													>
														Save Data in IPFS
													</label>
													<p className="text-gray-500">
														By default all listings
														data is erased after 7
														days. For a small fee,
														you can choose to save
														your listing data in
														IPFS indefinitely. This
														is useful if you think
														the seller may want to
														purchase the listing
														data off of you (e.g.
														this can be useful when
														later re-selling or
														proving provenance, e.g.
														when listing things like
														art, collectables or
														antiques)
													</p>
												</div>
											</div> */}

											<div className="relative flex items-start">
												<div className="flex items-center h-5">
													<input
														id="third-party"
														name="third-party"
														type="checkbox"
														className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
														onChange={(e) =>
															setUseThirdParty(
																!useThirdParty
															)
														}
													/>
												</div>
												<div className="ml-3 text-sm">
													<label
														htmlFor="third-party"
														className="font-medium text-gray-700"
													>
														Trusted Third Party
														Exchange
													</label>
													<p className="text-gray-500">
														If you&rsquo;d like to
														leave your item with a
														trusted third party to
														complete and finalize
														the exchange, you can
														enter their ETH address
														here. This is usually
														the address of a shop,
														auction house or estate
														agent, but it can be any
														third party that you
														trust to securely hold
														your item until the
														funds are received.
													</p>
												</div>
											</div>

											<div className="mt-6 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-8 content-center">
												<div className="sm:col-span-1"></div>

												<div
													className={`sm:col-span-7 ${
														useThirdParty
															? ""
															: "hidden"
													}`}
												>
													<div className="mt-1 flex rounded-md shadow-sm">
														<span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
															ETH address
														</span>
														<input
															type="text"
															name="company-website"
															id="company-website"
															className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300"
															placeholder="0x"
															value={
																thirdPartyEthAddress
															}
															onChange={(e) =>
																setThirdPartyEthAddress(
																	e.target
																		.value
																)
															}
														/>
													</div>
												</div>
											</div>
										</div>
									</fieldset>
								</div>
							</div>
						</div>

						<div className="pt-5">
							<div className="flex justify-end">
								<Link href="/listings">
									<a
										type="button"
										className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
									>
										Cancel
									</a>
								</Link>
								<button
									type="submit"
									onClick={(e) => save(e)}
									className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
								>
									Save
								</button>
							</div>
						</div>
					</form>
				)}
			</div>
			<ErrorAlert
				open={showError}
				setOpen={setShowError}
				errorTitle={error.title}
				errorMessage={error.message}
			/>

			<SuccessAlert
				open={showAlert}
				setOpen={setShowAlert}
				alertTitle={alert.title}
				alertMessage={alert.message}
				callToAction="View Listing"
				navigate={`/listings/${newListingCid}`}
			/>
		</div>
	);
}
