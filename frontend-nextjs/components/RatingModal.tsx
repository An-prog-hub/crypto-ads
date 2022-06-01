import { Fragment, useContext, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import getWeb3 from "../utils/getWeb3";
import { StarIcon } from "@heroicons/react/solid";
import { ListingsContext } from "../context/listings";
import ErrorAlert from "./ErrorAlert";
import SuccessAlert from "./SuccessAlert";

function classNames(...classes: any) {
	return classes.filter(Boolean).join(" ");
}

export default function RatingModal({ open, setOpen, listing }: any) {
	const { getAllProducts } = useContext<{
		getAllProducts: any;
	}>(ListingsContext as any);
	const [ratings, setRatings] = useState(5);

	const [showMetamaskError, setShowMetamaskError] = useState(false);
	const [showAlert, setShowAlert] = useState(false);

	const leaveRating = async () => {
		try {
			await getWeb3.rateSeller(listing.id, ratings);
			setOpen(false);
			setShowAlert(true);
			getAllProducts();
			setRatings(5);
		} catch (err) {
			console.error(err);
			setShowMetamaskError(true);
		}
	};

	const close = () => {
		setOpen(false);
		setRatings(5);
	};

	const cancelButtonRef = useRef(null);

	if (!listing) return <></>;

	return (
		<div>
			<Transition.Root show={open} as={Fragment}>
				<Dialog
					as="div"
					className="relative z-10"
					initialFocus={cancelButtonRef}
					onClose={close}
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
								<Dialog.Panel className="relative bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full sm:p-6">
									<div>
										<div className="mt-3 text-center sm:mt-5">
											<Dialog.Title
												as="h3"
												className="text-lg leading-6 font-medium text-gray-900"
											>
												Leave a rating
											</Dialog.Title>
											<div className="mt-2">
												<div
													style={{
														justifyContent:
															"center",
													}}
													className="flex items-center"
												>
													<div className="flex items-center">
														{[0, 1, 2, 3, 4].map(
															(rating) => (
																<div
																	className="pt-1"
																	key={rating}
																>
																	<StarIcon
																		className={classNames(
																			ratings >
																				rating
																				? "text-yellow-300"
																				: "text-gray-300",
																			"h-14 w-14 flex-shrink-0 "
																		)}
																		style={{
																			fontSize: 30,
																		}}
																		aria-hidden="true"
																		onClick={() => {
																			setRatings(
																				rating +
																					1
																			);
																		}}
																	/>
																</div>
															)
														)}
													</div>
												</div>
											</div>
										</div>
										{listing && listing.user ? (
											<>
												<p className="pt-3">
													You&rsquo;re leaving a
													rating of{" "}
													{ratings >= 0 ? ratings : 0}{" "}
													for seller{" "}
													{listing.user.substring(
														0,
														5
													) +
														"..." +
														listing.user.substring(
															listing.user
																.length - 4,
															listing.user.length
														)}
													. Your rating will be stored
													in a smart contract and
													cannot be changed later.
												</p>
											</>
										) : (
											""
										)}
									</div>
									<div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
										<button
											type="button"
											className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:col-start-2 sm:text-sm"
											onClick={() => leaveRating()}
										>
											Leave Rating
										</button>
										<button
											type="button"
											className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:col-start-1 sm:text-sm"
											onClick={() => close()}
											ref={cancelButtonRef}
										>
											Cancel
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
				errorTitle={"Error sending rating"}
				errorMessage={
					"You can't leave a rating until the seller has purchase is confirmed."
				}
			/>
			<SuccessAlert
				open={showAlert}
				setOpen={setShowAlert}
				alertTitle={"Rating Sent"}
				alertMessage={
					"You're rating has been sent and now lives on the blockchain!"
				}
			/>
		</div>
	);
}
