import { Fragment, useContext, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { ExclamationIcon } from "@heroicons/react/outline";
import getWeb3 from "../utils/getWeb3";
import ErrorAlert from "./ErrorAlert";
import SuccessAlert from "./SuccessAlert";
import { ListingsContext } from "../context/listings";

export default function ConfirmBuy({ open, setOpen, listing }: any) {
	const { getAllProducts } = useContext<{
		getAllProducts: any;
	}>(ListingsContext as any);

	const cancelButtonRef = useRef(null);

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

	const confirmBuyInMetamask = async () => {
		try {
			await getWeb3.confirmBuy(listing.id);

			setAlert({
				title: "Purchase Confirmed!",
				message: "You've paid for your item!",
			});
			setShowAlert(true);
			getAllProducts();
		} catch (err) {
			setError({
				title: "Payment Failed",
				message:
					"Sorry, there was an issue sending your confirmation to the EVM. Please try again later.",
			});
			setShowError(true);
		}
	};

	return (
		<>
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
								<Dialog.Panel className="relative bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg sm:w-full sm:p-6">
									<div className="sm:flex sm:items-start">
										<div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
											<ExclamationIcon
												className="h-6 w-6 text-red-600"
												aria-hidden="true"
											/>
										</div>
										<div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
											<Dialog.Title
												as="h3"
												className="text-lg leading-6 font-medium text-gray-900"
											>
												Confirm Purchase
											</Dialog.Title>
											<div className="mt-2">
												<p className="text-sm text-gray-500">
													Please ensure that either
													you or your trusted third
													party are in possession of
													this item (
													<b>{`${listing?.name?.substring(
														0,
														20
													)}...`}</b>
													). This action transfers
													funds to the seller&rsquo;s
													ethereum wallet and cannot
													be undone.
												</p>
											</div>
										</div>
									</div>
									<div className="mt-5 sm:mt-4 sm:ml-10 sm:pl-4 sm:flex">
										<button
											type="button"
											className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:w-auto sm:text-sm"
											onClick={() => {
												confirmBuyInMetamask();
												setOpen(false);
											}}
										>
											Confirm
										</button>
										<button
											type="button"
											className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 px-4 py-2 bg-white text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
											onClick={() => setOpen(false)}
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
				navigate={`/listings/${listing.id}`}
			/>
		</>
	);
}
