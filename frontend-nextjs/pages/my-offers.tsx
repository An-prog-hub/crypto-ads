import { PlusIcon } from "@heroicons/react/solid";
import Link from "next/link";
import { useCallback, useContext, useEffect, useState } from "react";
import ConfirmBuy from "../components/ConfirmBuy";
import ErrorAlert from "../components/ErrorAlert";
import RatingModal from "../components/RatingModal";
import { ListingsContext } from "../context/listings";
import getWeb3 from "../utils/getWeb3";
import { CardListing } from "./listings";

function classNames(...classes: any) {
	return classes.filter(Boolean).join(" ");
}

export default function MyOffers() {
	const [openConfirmBuyModal, setOpenConfirmBuyModal] = useState(false);
	const { listings } = useContext<{ listings: CardListing[] }>(
		ListingsContext as any
	);

	const [currentAccount, setCurrentAccount] = useState("");
	const [listingToConfirm, setListingToConfirm] = useState({});
	const [offers, setOffers] = useState<Array<CardListing>>([]);

	const [showMetamaskError, setShowMetamaskError] = useState(false);
	const [metaMaskShown, setMetaMaskShown] = useState(false);

	// leave review
	const [listingToReview, setListingToReview] = useState({});
	const [openReviewModal, setOpenReviewModal] = useState(false);

	const setAccount = async () => {
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

	useEffect(() => {
		setAccount();
	}, [listings]);

	useEffect(() => {
		const filteredListings = listings?.filter((product) =>
			product.offersMade.find(
				(offer) =>
					offer.buyer.toLowerCase() === currentAccount.toLowerCase()
			)
		);
		setOffers(filteredListings);
	}, [currentAccount, listings]);

	return (
		<div className="">
			<div className="max-w-7xl mx-auto pt-20 pb-20 px-4 sm:px-6 lg:px-8">
				<div className="px-4 sm:px-6 lg:px-8">
					<div className="sm:flex sm:items-center">
						<div className="sm:flex-auto">
							<h1 className="text-xl font-semibold text-gray-900">
								Your Offers
							</h1>
							<p className="mt-2 text-sm text-gray-700">
								View everything that you&rsquo;ve made an offer
								on. Once you&rsquo;ve made an offer,
								you&rsquo;ll need to coordinate with the seller
								to finalize the exchange. You can either meet up
								in person, or leave the funds and goods with a
								trusted third party.
							</p>
						</div>
					</div>
					<div className="mt-8 flex flex-col">
						<div className="-my-2 -mx-4 sm:-mx-6 lg:-mx-8">
							<div className="inline-block min-w-full py-2 align-middle">
								<div className="shadow-sm ring-1 ring-black ring-opacity-5">
									{offers.length ? (
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
														<span className="sr-only">
															Seller
														</span>
													</th>
													<th
														scope="col"
														className="sticky top-0 z-10 hidden border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell"
													>
														<span className="sr-only">
															Highest Bid
														</span>
													</th>

													{/* <th
														scope="col"
														className="sticky top-0 z-10 hidden border-b border-gray-300 bg-gray-50 bg-opacity-75 px-3 py-3.5 text-left text-sm font-semibold text-gray-900 backdrop-blur backdrop-filter lg:table-cell"
													>
														<span className="sr-only">
															Send Message
														</span>
													</th> */}
													<th
														scope="col"
														className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 py-3.5 pr-4 pl-3 backdrop-blur backdrop-filter sm:pr-6 lg:pr-8"
													>
														<span className="sr-only">
															View
														</span>
													</th>
													<th
														scope="col"
														className="sticky top-0 z-10 border-b border-gray-300 bg-gray-50 bg-opacity-75 py-3.5 pr-4 pl-3 backdrop-blur backdrop-filter sm:pr-6 lg:pr-8"
													>
														<span className="sr-only">
															Confirm Buy
														</span>
													</th>
												</tr>
											</thead>
											<tbody className="bg-white">
												{offers.map(
													(listing, listingIdx) => (
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
																	"whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden sm:table-cell"
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
																	"whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden sm:table-cell"
																)}
															>
																{listing.user}
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
																{listing.isAuction ? (
																	<>
																		{listing.auctionData?.highestBidder.toLowerCase() ===
																		currentAccount.toLowerCase() ? (
																			<>
																				<span className="m-3 inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-green-100 text-green-800">
																					Highest
																					bid!
																				</span>
																			</>
																		) : (
																			<span className="pl-3 inline-flex items-center px-3 py-0.5 rounded-full text-sm font-medium bg-red-100 text-red-800">
																				Low
																				Offer
																			</span>
																		)}
																	</>
																) : (
																	""
																)}
															</td>

															{/* <td
																className={classNames(
																	listingIdx !==
																		listings.length -
																			1
																		? "border-b border-gray-200"
																		: "",
																	"whitespace-nowrap px-3 py-4 text-sm text-gray-500 hidden lg:table-cell"
																)}
															>
																<button className="text-indigo-600 hover:text-indigo-900">
																	Message
																</button>
															</td> */}

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
																		Listing
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

															{listing.bought ? (
																<>
																	{listing.canBeReviewed ? (
																		<>
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
																				<button
																					type="button"
																					className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm bg-yellow-100 text-yellow-800 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-200"
																					onClick={(
																						e
																					) => {
																						e.preventDefault();
																						setListingToReview(
																							listing
																						);
																						setOpenReviewModal(
																							true
																						);
																					}}
																				>
																					Leave
																					rating
																				</button>
																			</td>
																		</>
																	) : (
																		<>
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
																				<button
																					type="button"
																					className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm bg-green-100 text-green-800 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-200"
																				>
																					Completed!
																				</button>
																			</td>
																		</>
																	)}
																</>
															) : (
																<>
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
																		<button
																			type="button"
																			className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
																			onClick={(
																				e
																			) => {
																				e.preventDefault();
																				setListingToConfirm(
																					listing
																				);
																				setOpenConfirmBuyModal(
																					true
																				);
																			}}
																		>
																			Confirm
																			Buy
																		</button>
																	</td>
																</>
															)}
														</tr>
													)
												)}
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
												No Offers
											</h3>
											<p className="mt-1 text-sm text-gray-500">
												Get started by making an offer
												on a listing.
											</p>
											<div className="mt-6">
												<Link href={"/listings"}>
													<button
														type="button"
														className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
													>
														View Listings
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
				<ConfirmBuy
					open={openConfirmBuyModal}
					setOpen={setOpenConfirmBuyModal}
					listing={listingToConfirm}
				/>

				<RatingModal
					open={openReviewModal}
					setOpen={setOpenReviewModal}
					listing={listingToReview}
				/>
				<ErrorAlert
					open={showMetamaskError}
					setOpen={setShowMetamaskError}
					errorTitle={"Metamask Error"}
					errorMessage={
						"In order to view any offers you've made you'll need to connect your Metamask account."
					}
				/>
			</div>
		</div>
	);
}
