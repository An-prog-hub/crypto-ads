import Link from "next/link";
import { useContext, useEffect, useState } from "react";
import { AccountsContext } from "../context/accounts";
import { ListingsContext } from "../context/listings";

import ErrorAlert from "./ErrorAlert";
import SuccessAlert from "./SuccessAlert";

export default function LandingPageHeader() {
	const { getAllProducts } = useContext<{
		getAllProducts: any;
	}>(ListingsContext as any);

	const [showMetamaskEnabled, setShowMetamaskEnabled] = useState(false);
	const [showMetamaskError, setShowMetamaskError] = useState(false);
	const { account, getAccounts } = useContext(AccountsContext as any);

	const enableMetamask = async () => {
		try {
			await getAccounts();
			setShowMetamaskEnabled(true);
		} catch (err) {
			setShowMetamaskError(true);
		}
	};

	useEffect(() => {
		getAllProducts();
	}, []);

	return (
		<div className="relative bg-white overflow-hidden">
			<div className="max-w-7xl mx-auto">
				<div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
					<svg
						className="hidden lg:block absolute right-0 inset-y-0 h-full w-48 text-white transform translate-x-1/2"
						fill="currentColor"
						viewBox="0 0 100 100"
						preserveAspectRatio="none"
						aria-hidden="true"
					>
						<polygon
							className="z-30"
							points="50,0 100,0 50,100 0,100"
						/>
					</svg>
					<div className="relative pt-6 px-4 sm:px-6 lg:px-8"></div>

					<main className="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
						<div>
							<img
								className="h-28 w-auto"
								src="/logo.png"
								alt="Barrio"
							/>
							{/* <h1
								className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl"
								// style={{ color: "ecb2be" }}
							>
								arrio
							</h1> */}
						</div>
						<div className="sm:text-center lg:text-left pl-5">
							<h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
								<span className="block xl:inline">
									Decentralized
								</span>{" "}
								<span className="block text-indigo-600 xl:inline">
									classified ads
								</span>
							</h1>
							<p className="mt-3 z-50 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
								An ecosystem to buy and sell pre-loved items,
								powered by Ethereum and IPFS. Help build a
								blockchain based second-hand market by listing
								items, storing data and earning credits. By
								reusing items, together we can build sustainable
								economies.
							</p>
							<div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
								<div className="rounded-md shadow">
									<Link href="/listings">
										<a className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 md:py-4 md:text-lg md:px-10">
											Browse Listings
										</a>
									</Link>
								</div>
								<div className="mt-3 sm:mt-0 sm:ml-3">
									<a
										href="#"
										onClick={() => enableMetamask()}
										className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 md:py-4 md:text-lg md:px-10"
									>
										Connect Metamask
									</a>
								</div>
							</div>
						</div>
					</main>
				</div>
			</div>
			<div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2">
				<img
					className="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
					src="classified-ads.jpeg"
					alt=""
				/>
			</div>
			<SuccessAlert
				open={showMetamaskEnabled}
				setOpen={setShowMetamaskEnabled}
				account={account}
				alertTitle={""}
				alertMessage={`You've successfully linked your
				metamask account with wallet: 
				${account}. You can now post new
				listings and make offers on
				items.`}
			/>
			<ErrorAlert
				open={showMetamaskError}
				setOpen={setShowMetamaskError}
				errorTitle={"Metamask Error"}
				errorMessage={
					"There was an issue connected your metamask account. Ensure that you're logged in and that you've addressed any pending notifications in Metamask."
				}
			/>
		</div>
	);
}
