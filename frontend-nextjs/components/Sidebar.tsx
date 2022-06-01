import {
	ChatIcon,
	ClipboardIcon,
	FireIcon,
	SearchIcon,
	UserIcon,
} from "@heroicons/react/outline";
import { XIcon } from "@heroicons/react/solid";
import Link from "next/link";
import { useEffect, useState } from "react";
import getWeb3 from "../utils/getWeb3";

const navigation = [
	{ name: "Profile", icon: UserIcon, href: "/profile", current: false },
	{
		name: "All Listings",
		icon: SearchIcon,
		href: "/listings",
		current: false,
	},
	{
		name: "My Listings",
		icon: ClipboardIcon,
		href: "/my-listings",
		current: false,
	},
	{
		name: "My Offers",
		icon: FireIcon,
		href: "/my-offers",
		count: 0,
		current: false,
	},
	{
		name: "Messages",
		icon: ChatIcon,
		href: "/messages",
		count: 0,
		current: false,
	},
];

function classNames(...classes: any) {
	return classes.filter(Boolean).join(" ");
}

export default function Sidebar({ setSidebarOpen }: any) {
	const [currentAccount, setCurrentAccount] = useState("");

	const setAccount = async () => {
		try {
			const account = await getWeb3.getAccounts();
			setCurrentAccount(account);
		} catch (err) {}
	};

	useEffect(() => {
		setAccount();
	}, []);

	return (
		<div className="h-full flex-1 flex flex-col min-h-0 bg-indigo-700">
			<div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
				<div className="flex items-start justify-between px-4">
					<Link href={"/"}>
						<button onClick={() => setSidebarOpen(false)}>
							<img
								className="h-14 w-auto"
								src="/logo.png"
								alt="Barrio"
							/>
						</button>
					</Link>
					<div>
						<button
							type="button"
							className="-m-2 p-2 text-gray-400 hover:text-gray-500 right object-right"
							onClick={() => setSidebarOpen(false)}
						>
							<span className="sr-only">Close panel</span>
							<XIcon className="h-6 w-6" aria-hidden="true" />
						</button>
					</div>
				</div>
				<nav
					className="mt-5 flex-1 px-2 space-y-1"
					aria-label="Sidebar"
				>
					{navigation.map((item) => (
						<Link key={item.name} href={item.href}>
							<a
								className={classNames(
									item.current
										? "bg-indigo-800 text-white"
										: "text-indigo-100 hover:bg-indigo-600 hover:bg-opacity-75",
									"group flex items-center px-2 py-2 text-sm font-medium rounded-md"
								)}
								onClick={() => setSidebarOpen(false)}
							>
								<item.icon
									className="mr-3 flex-shrink-0 h-6 w-6 text-indigo-300"
									aria-hidden="true"
								/>
								<span className="flex-1">{item.name}</span>
								{item.count ? (
									<span
										className={classNames(
											item.current
												? "bg-indigo-600"
												: "bg-indigo-800",
											"ml-3 inline-block py-0.5 px-3 text-xs font-medium rounded-full"
										)}
									>
										{item.count}
									</span>
								) : null}
							</a>
						</Link>
					))}
				</nav>
			</div>
			<div className="flex-shrink-0 flex border-t border-indigo-800 p-4">
				<a href="#" className="flex-shrink-0 w-full group block">
					<div className="flex items-center">
						<div>
							<img
								className="inline-block h-9 w-9 rounded-full"
								src="/jazzicon.png"
								alt=""
							/>
						</div>
						<div className="ml-3">
							<p className="text-sm font-medium text-white">
								{currentAccount.substring(0, 5) +
									"..." +
									currentAccount.substring(
										currentAccount.length - 4,
										currentAccount.length
									)}
							</p>
							<Link href="/profile">
								<button onClick={() => setSidebarOpen(false)}>
									<p className="text-xs font-medium text-indigo-200 group-hover:text-white">
										View profile
									</p>
								</button>
							</Link>
						</div>
					</div>
				</a>
			</div>
		</div>
	);
}
