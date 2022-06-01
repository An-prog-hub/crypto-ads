import { Fragment, useContext, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { CreditCardIcon } from "@heroicons/react/solid";
import { CardListing, Offer } from "../pages/listings";
import ErrorAlert from "./ErrorAlert";
import SuccessAlert from "./SuccessAlert";
import getWeb3 from "../utils/getWeb3";
import { ListingsContext } from "../context/listings";

export default function OffersModal({
	open,
	setOpen,
	listing,
}: {
	open: boolean;
	setOpen: any;
	listing: CardListing;
}) {
	const { getAllProducts } = useContext<{
		getAllProducts: any;
	}>(ListingsContext as any);

	const [showMetamaskError, setShowMetamaskError] = useState(false);
	const [showAlert, setShowAlert] = useState(false);

	const cancelButtonRef = useRef(null);

	if (!listing) return <></>;

	const acceptOffer = async (listing: string, buyer: string) => {
		try {
			await getWeb3.acceptOffer(listing, buyer);
			setShowAlert(true);
			getAllProducts();
		} catch (err) {
			setShowMetamaskError(true);
		}
	};

	return (
		<div>
			<Transition.Root show={open} as={Fragment}>
				<Dialog
					as="div"
					className="relative z-10"
					initialFocus={cancelButtonRef}
					onClose={setOpen}
				>
					<Transition.Child
						as={Fragment}
						enter="ease-out duration-300"
						enterFrom="opacity-0"
						enterTo="opacity-100"
						leave="ease-in duration-200"
						leaveFrom="opacity-100"
						leaveTo="opacity-0"
					>
						<div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
					</Transition.Child>

					<div className="fixed z-10 inset-0 overflow-y-auto">
						<div className="flex items-end sm:items-center justify-center min-h-full p-4 text-center sm:p-0">
							<Transition.Child
								as={Fragment}
								enter="ease-out duration-300"
								enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
								enterTo="opacity-100 translate-y-0 sm:scale-100"
								leave="ease-in duration-200"
								leaveFrom="opacity-100 translate-y-0 sm:scale-100"
								leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
							>
								<Dialog.Panel className="relative bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-2xl sm:w-full sm:p-6">
									<div>
										<div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
											<CreditCardIcon
												className="h-6 w-6 text-green-600"
												aria-hidden="true"
											/>
										</div>
										<div className="mt-3 text-center sm:mt-5">
											<Dialog.Title
												as="h3"
												className="text-lg leading-6 font-medium text-gray-900"
											>
												Offers Recieved
											</Dialog.Title>
											<div className="mt-2">
												<p className="text-sm text-gray-500">
													You&rsquo;ve received the
													following offers on your
													items. These funds are held
													in a smart contract until
													the buyer confirms they have
													received your item. In order
													to complete a sale,
													you&rsquo;ll need to
													coordinate with the buyer to
													exchange the item, and
													ensure that they select
													&ldquo;Confirm
													Purchase&rdquo in the app.
													Once they&rsquo;ve done
													this, the funds will be
													released into your ethereum
													wallet.
												</p>
											</div>
										</div>
									</div>
									{listing.offersMade.length ? (
										<>
											<div className="mt-8 flex flex-col">
												<div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
													<div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
														<table className="min-w-full divide-y divide-gray-300">
															<thead>
																<tr>
																	<th
																		scope="col"
																		className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6 md:pl-0"
																	>
																		Address
																	</th>
																	<th
																		scope="col"
																		className="py-3.5 px-3 text-left text-sm font-semibold text-gray-900"
																	>
																		ETH
																		Price
																	</th>
																	<th
																		scope="col"
																		className="relative py-3.5 pl-3 pr-4 sm:pr-6 md:pr-0"
																	>
																		<span className="sr-only">
																			Message
																		</span>
																	</th>
																	<th
																		scope="col"
																		className="relative py-3.5 pl-3 pr-4 sm:pr-6 md:pr-0"
																	>
																		<span className="sr-only">
																			Accept
																			Offer
																		</span>
																	</th>
																</tr>
															</thead>
															<tbody className="divide-y divide-gray-200">
																{listing.offersMade.map(
																	(offer) => (
																		<tr
																			key={
																				offer.buyer
																			}
																		>
																			<td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
																				{
																					offer.buyer
																				}
																			</td>
																			<td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
																				{
																					offer.offer
																				}
																			</td>

																			<td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 md:pr-0">
																				<a
																					href="#"
																					className="text-indigo-600 hover:text-indigo-900"
																				>
																					Message
																					<span className="sr-only">
																						,{" "}
																						{
																							offer.buyer
																						}
																					</span>
																				</a>
																			</td>

																			{listing.isAuction ? (
																				<td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6 md:pr-0">
																					<a
																						href="#"
																						className="text-indigo-600 hover:text-indigo-900"
																					>
																						<button
																							type="button"
																							className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-full shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
																							onClick={() =>
																								acceptOffer(
																									listing.id,
																									offer.buyer
																								)
																							}
																						>
																							Accept
																							Offer
																						</button>
																					</a>
																				</td>
																			) : (
																				""
																			)}
																		</tr>
																	)
																)}
															</tbody>
														</table>
													</div>
												</div>{" "}
											</div>
										</>
									) : (
										<div className="mt-3 text-center sm:mt-5">
											<p className="text-sm text-gray-500">
												You haven&rsquo;t received any
												offers yet.
											</p>
										</div>
									)}

									<div className="mx-auto flex items-center justify-center mt-5 sm:mt-6 sm:grid ">
										<button
											type="button"
											className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
											onClick={() => setOpen(false)}
										>
											Close
										</button>
									</div>
								</Dialog.Panel>
							</Transition.Child>
						</div>
					</div>
				</Dialog>
			</Transition.Root>
			<ErrorAlert
				open={showMetamaskError}
				setOpen={setShowMetamaskError}
				errorTitle={"Error accepting offer"}
				errorMessage={"The was an error processing this request."}
			/>
			<SuccessAlert
				open={showAlert}
				setOpen={setShowAlert}
				alertTitle={"Offer Accepted"}
				alertMessage={
					"You've accepted this offer. Now you just need to coordinate with the buyer to finalize the exchange. They'll need to confirm the purchase in the app before the funds are released into your wallet."
				}
			/>
		</div>
	);
}
