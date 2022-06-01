import { PlusIcon } from "@heroicons/react/solid";
import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import ErrorAlert from "../components/ErrorAlert";
import OffersModal from "../components/OffersModal";
import { ListingsContext } from "../context/listings";
import getWeb3 from "../utils/getWeb3";
import { CardListing, Offer } from "./listings";

function classNames(...classes: any) {
	return classes.filter(Boolean).join(" ");
}

export default function MyListings() {
	const { listings } = useContext<{ listings: CardListing[] }>(
		ListingsContext as any
	);
	const [currentAccount, setCurrentAccount] = useState(
		getWeb3.currentAccount
	);
	const [showOffers, setShowOffers] = useState(false);
	const [showOffersForListing, setShowOffersForListing] =
		useState<CardListing>();

	const [showMetamaskError, setShowMetamaskError] = useState(false);
	const [metaMaskShown, setMetaMaskShown] = useState(false);

	const getAccount = async () => {
		try {
			const account = await getWeb3.getAccounts();
			setCurrentAccount(account);
		} catch (err) {
			// we only need to tell the user once when navigating to the page
			if (!metaMaskShown) {
				setShowMetamaskError(true);
				setMetaMaskShown(true);
			}
		}
	};

	const showListingState = (listing: CardListing) => {
		const shouldShowOffersForAuction = (listing: CardListing) => {
			if (listing.isAuction) return !listing.auctionData?.isAccepted;
			return true;
		};

		const showOffers =
			!listing.bought &&
			listing.offersMade.length &&
			shouldShowOffersForAuction(listing);
		const showCompleted = listing.bought;
		const showNoOffersRecieved =
			!listing.bought && !listing.offersMade.length;
		const showAuctionLabel = listing.isAuction;
		const showOfferAlreadyAccepted =
			!shouldShowOffersForAuction(listing) && listing.isAuction;
		return {
			showAuctionLabel,
			showNoOffersRecieved,
			showOfferAlreadyAccepted,
			showCompleted,
			showOffers,
		};
	};

	useEffect(() => {
		getAccount();
	}, [listings]);

	return (
		<div className="max-w-7xl mx-auto pt-20 pb-20 px-4 sm:px-6 lg:px-8">
			<div className="px-4 sm:px-6 lg:px-8">
				<div className="sm:flex sm:items-center">
					<div className="sm:flex-auto">
						<h1 className="text-xl font-semibold text-gray-900">
							Your Listings
						</h1>
						<p className="mt-2 text-sm text-gray-700">
							View all your listings here, and see any offers that
							have been made.
						</p>
					</div>
				</div>
				<div className="mt-8 flex flex-col">
					<div className="-my-2 -mx-4 sm:-mx-6 lg:-mx-8">
						<div className="inline-block min-w-full py-2 align-middle">
							<div className="shadow-sm ring-1 ring-black ring-opacity-5">
								{listings?.filter(
									(product) => product.user === currentAccount
								).length ? (
									<table
										className="min-w-full border-separate"
										style={{ borderSpacing: 0 }}
									>
										<thead className="bg-gray-50">
											<tr>
												<th
													scope="col"
													className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:pl-6 lg:pl-8"
												>
													Title
												</th>
												<th
													scope="col"
													className="sticky top-0 z-10 hidden border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter sm:table-cell"
												>
													Description
												</th>
												<th
													scope="col"
													className="sticky top-0 z-10 hidden border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell"
												>
													Offers
												</th>
												<th
													scope="col"
													className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 py-3.5 pr-4 pl-3 backdrop-blur backdrop-filter sm:pr-6 lg:pr-8"
												>
													<span className="sr-only">
														View
													</span>
												</th>
											</tr>
										</thead>
										<tbody className="bg-white">
											{listings
												?.filter(
													(product) =>
														product.user ===
														currentAccount
												)
												.map((listing, listingIdx) => (
													<tr key={listing.id}>
														<td
															className={classNames(
																listingIdx !==
																	listings.length -
																		1
																	? "border-b border-gray-200"
																	: "",
																"whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6 lg:pl-8"
															)}
														>
															{`${listing.name.substring(
																0,
																20
															)}...`}
														</td>
														<td
															className={classNames(
																listingIdx !==
																	listings.length -
																		1
																	? "border-b border-gray-200"
																	: "",
																"whitespace-nowrap text-ellipsis px-3 py-4 text-sm text-gray-500 hidden sm:table-cell"
															)}
														>
															{`${listing.description.substring(
																0,
																40
															)}...`}
														</td>
														<td
															className={classNames(
																listingIdx !==
																	listings.length -
																		1
																	? "border-b border-gray-200"
																	: "",
																"whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden lg:table-cell"
															)}
														>
															{!showListingState(
																listing
															).showCompleted ? (
																<>
																	{showListingState(
																		listing
																	)
																		.showOfferAlreadyAccepted ? (
																		<>
																			{listing
																				.auctionData
																				?.isAccepted ? (
																				"Offer accepted"
																			) : (
																				<>

																				</>
																			)}
																		</>
																	) : (
																		<></>
																	)}

																	{showListingState(
																		listing
																	)
																		.showOffers ? (
																		<Link
																			href={`#`}
																		>
																			<a
																				className="text-indigo-600 hover:text-indigo-900"
																				onClick={(
																					e
																				) => {
																					e.preventDefault();
																					setShowOffers(
																						true
																					);
																					setShowOffersForListing(
																						listing
																					);
																				}}
																			>
																				View
																				Offers
																				<span className="sr-only">
																					,{" "}
																					{`${listing.name.substring(
																						0,
																						20
																					)}...`}
																				</span>
																			</a>
																		</Link>
																	) : (
																		""
																	)}
																	{showListingState(
																		listing
																	)
																		.showNoOffersRecieved
																		? "No offers received"
																		: ""}
																	{showListingState(
																		listing
																	)
																		.showAuctionLabel ? (
																		<span className="ml-5 inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
																			Auction
																		</span>
																	) : (
																		<></>
																	)}
																</>
															) : (
																<>
																	<a className="inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
																		Completed
																	</a>
																</>
															)}
														</td>

														<td
															className={classNames(
																listingIdx !==
																	listings.length -
																		1
																	? "border-b border-gray-200"
																	: "",
																"relative whitespace-nowrap py-4 pr-4 pl-3 text-right text-sm font-medium sm:pr-6 lg:pr-8"
															)}
														>
															<Link
																href={`/listings/${listing.id}`}
															>
																<a className="text-indigo-600 hover:text-indigo-900">
																	View
																	<span className="sr-only">
																		,{" "}
																		{`${listing.name.substring(
																			0,
																			20
																		)}...`}
																	</span>
																</a>
															</Link>
														</td>
													</tr>
												))}
										</tbody>
									</table>
								) : (
									<div className="text-center p-10">
										<svg
											className="mx-auto h-12 w-12 text-gray-400"
											fill="none"
											viewBox="0 0 24 24"
											stroke="currentColor"
											aria-hidden="true"
										>
											<path
												vectorEffect="non-scaling-stroke"
												strokeLinecap="round"
												strokeLinejoin="round"
												strokeWidth={2}
												d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
											/>
										</svg>
										<h3 className="mt-2 text-sm font-medium text-gray-900">
											No Listings
										</h3>
										<p className="mt-1 text-sm text-gray-500">
											Get started by creating a new
											listing.
										</p>
										<div className="mt-6">
											<Link href={"/new-listing"}>
												<button
													type="button"
													className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
												>
													<PlusIcon
														className="-ml-1 mr-2 h-5 w-5"
														aria-hidden="true"
													/>
													New Listing
												</button>
											</Link>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
			<OffersModal
				open={showOffers}
				setOpen={setShowOffers}
				listing={showOffersForListing as CardListing}
			/>
			<ErrorAlert
				open={showMetamaskError}
				setOpen={setShowMetamaskError}
				errorTitle={"Metamask Error"}
				errorMessage={
					"In order to view your listings, you'll need to connect your Metamask account."
				}
			/>
		</div>
	);
}
