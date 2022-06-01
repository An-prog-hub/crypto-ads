import { useContext, useState } from "react";
import { Popover } from "@headlessui/react";
import { DotsVerticalIcon, SearchIcon } from "@heroicons/react/solid";
import { MenuIcon, XIcon } from "@heroicons/react/outline";
import Slideover from "./Slideover";
import getWeb3 from "../utils/getWeb3";
import SuccessAlert from "./SuccessAlert";
import ErrorAlert from "./ErrorAlert";
import Link from "next/link";
import { CardListing } from "../pages/listings";
import { ListingsContext } from "../context/listings";
import { AccountsContext } from "../context/accounts";

const navigation = [
	{ name: "All Listings", href: "/listings", current: false },
	{ name: "My Listings", href: "/my-listings", current: false },
	{ name: "My Offers", href: "/my-offers", current: false },
	{ name: "Post Ad", href: "/new-listing", current: false },
	{ name: "Info", href: "/", current: true },
];

function classNames(...classes: any) {
	return classes.filter(Boolean).join(" ");
}

export default function Navbar() {
	const { getAllProducts } = useContext<{
		getAllProducts: any;
	}>(ListingsContext as any);

	const { account, getAccounts } = useContext(AccountsContext as any);

	const [sidebarOpen, setSidebarOpen] = useState(false);

	const [showMetamaskEnabled, setShowMetamaskEnabled] = useState(false);
	const [showMetamaskError, setShowMetamaskError] = useState(false);

	const enableMetamask = async () => {
		try {
			await getAccounts();
			setShowMetamaskEnabled(true);
			getAllProducts();
		} catch (err) {
			setShowMetamaskError(true);
		}
	};

	return (
		<>
			<Popover
				as="header"
				className={({ open }) =>
					classNames(
						open ? "fixed inset-0 z-40 overflow-y-auto" : "",
						"bg-white shadow-sm lg:static lg:overflow-y-visible"
					)
				}
			>
				{({ open }) => (
					<>
						<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-5 pb-5">
							<div className="relative flex justify-between">
								<div className="flex md:absolute md:left-0 md:inset-y-0 lg:static ">
									<div className="flex-shrink-0 flex items-center">
										<Link href="/">
											<button>
												<img
													className="block h-8 w-auto"
													src="/logo.png"
													alt="Barrio"
												/>
											</button>
										</Link>
									</div>
									<div className="flex md:absolute md:left-0 md:inset-y-0 lg:static ml-4">
										<div className="flex-shrink-0 flex items-center">
											<button
												onClick={() =>
													setSidebarOpen(true)
												}
											>
												<MenuIcon className="block h-8 w-auto focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 text-indigo-800" />
											</button>
										</div>
									</div>
								</div>
								<div className="flex items-center md:absolute md:right-0 md:inset-y-0 lg:hidden">
									{/* Mobile menu button */}
									<Popover.Button className="-mx-2 rounded-md p-2 inline-flex items-center justify-center text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500">
										<span className="sr-only">
											Open menu
										</span>
										{open ? (
											<XIcon
												className="block h-6 w-6"
												aria-hidden="true"
											/>
										) : (
											<MenuIcon
												className="block h-6 w-6"
												aria-hidden="true"
											/>
										)}
									</Popover.Button>
								</div>
								<div className="hidden lg:flex lg:items-center lg:justify-end">
									<div className="flex-shrink-0 relative ml-5">
										<button className="bg-white rounded-full flex focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
											<span className="sr-only">
												Open user menu
											</span>
											<img
												className="h-8 w-8 rounded-full"
												src="https://raw.githubusercontent.com/MetaMask/brand-resources/master/SVG/metamask-fox.svg"
												alt=""
												onClick={() => enableMetamask()}
											/>
										</button>
									</div>
									<Link href="/new-listing">
										<a className="ml-6 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
											Post ad
										</a>
									</Link>
								</div>
							</div>
						</div>

						<Popover.Panel
							as="nav"
							className="lg:hidden"
							aria-label="Global"
						>
							<div className="max-w-3xl mx-auto px-2 pt-2 pb-3 space-y-1 sm:px-4">
								{navigation.map((item) => (
									<Link key={item.name} href={item.href}>
										<a
											aria-current={
												item.current
													? "page"
													: undefined
											}
											className={classNames(
												item.current
													? "bg-gray-100 text-gray-900"
													: "hover:bg-gray-50",
												"block rounded-md py-2 px-3 text-base font-medium"
											)}
										>
											{item.name}
										</a>
									</Link>
								))}
							</div>
							<div className="border-t border-gray-200 pt-4 pb-3">
								<div className="max-w-3xl mx-auto px-4 flex items-center sm:px-6">
									<div className="flex-shrink-0"></div>
									<div className="ml-3">
										<div className="text-base font-medium text-gray-800">
											{account}
										</div>
									</div>
								</div>
							</div>
						</Popover.Panel>
					</>
				)}
			</Popover>
			<Slideover
				sidebarOpen={sidebarOpen}
				setSidebarOpen={setSidebarOpen}
			/>
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
		</>
	);
}
