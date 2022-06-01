import { PlusIcon } from "@heroicons/react/outline";
import Link from "next/link";
import { useContext } from "react";
import { ListingsContext } from "../context/listings";
import { AuctionData } from "../utils/getWeb3";

export type Offer = {
	buyer: string;
	offer: string;
};

export type CardListing = {
	id: string;
	name: string;
	date: string;
	price: string;
	description: string;
	images: Array<{
		id: string;
		name: string;
		src: string;
	}>;
	user: string;
	offersMade: Array<Offer>;
	bought: boolean;
	rating: number;
	location: string;
	isAuction: boolean;
	auctionData: AuctionData | undefined;
	useThirdPartyAddress: string;
	canBeReviewed: boolean;
};

export default function Listing() {
	const { listings } = useContext<{ listings: CardListing[] }>(
		ListingsContext as any
	);

	return (
		<div className="bg-white">
			<div className="max-w-2xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:max-w-7xl lg:px-8">
				<h2 className="sr-only">Products</h2>

				{listings.length ? (
					<div className="grid grid-cols-1 gap-y-10 sm:grid-cols-2 gap-x-6 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
						{listings?.map((product) => (
							<Link
								href={`listings/${product.id}`}
								key={product.id}
							>
								<a className="group">
									<div className="w-full aspect-w-1 aspect-h-1 bg-gray-200 rounded-lg overflow-hidden xl:aspect-w-7 xl:aspect-h-8">
										<img
											src={product.images[0].src}
											alt={product.images[0].name}
											className="w-full h-full object-center object-cover group-hover:opacity-75"
										/>
									</div>
									<h3 className="mt-4 text-sm text-gray-700">
										{product.name}
									</h3>
									<p className="mt-1 text-lg font-medium text-gray-900">
										{product.price} ETH
									</p>
								</a>
							</Link>
						))}
					</div>
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
							No listings :(
						</h3>
						<p className="mt-1 text-sm text-gray-500">
							Be the first to create a listing!
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
									Post Ad
								</button>
							</Link>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
