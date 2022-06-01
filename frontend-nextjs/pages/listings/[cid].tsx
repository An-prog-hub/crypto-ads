import { useContext, useEffect, useState } from "react";
import { Disclosure, Tab } from "@headlessui/react";
import { StarIcon } from "@heroicons/react/solid";
import { HeartIcon, MinusSmIcon, PlusSmIcon } from "@heroicons/react/outline";
import { getListing } from "../../utils/getOrbitData";
import { useRouter } from "next/router";
import { makeGatewayURL } from "../../utils/getIpfs";
import getWeb3 from "../../utils/getWeb3";
import { CardListing, Offer } from "../listings";
import ErrorAlert from "../../components/ErrorAlert";
import SuccessAlert from "../../components/SuccessAlert";
import { ListingsContext } from "../../context/listings";
import LoadingSpinner from "../../components/LoadingSpinner";
import ListingCard from "../../components/ListingCard";
import AuctionListingCard from "../../components/AuctionListingCard";
import { AccountsContext } from "../../context/accounts";

export default function Listing() {
	const { listings, getAllProducts } = useContext<{
		listings: CardListing[];
		getAllProducts: any;
	}>(ListingsContext as any);

	const { account } = useContext(AccountsContext as any);

	useEffect(() => {
		getAllProducts();
	}, [account]);

	const router = useRouter();
	const { cid } = router.query;

	const [product, setProduct] = useState<CardListing>(null as any);
	const [isLoading, setLoading] = useState(true);

	// errors
	const [_noProduct, setNoProduct] = useState(false);

	const setListing = () => {
		const foundListing = listings.find((listing) => listing.id === cid);
		if (foundListing) {
			setProduct(foundListing);
		}
		setLoading(false);
	};

	useEffect(() => {
		if (!router.isReady) return;
	}, [router.isReady]);

	useEffect(() => {
		setListing();
	}, [listings]);

	if (isLoading)
		return (
			<div className="max-w-7xl mx-auto pt-20 pb-20 px-4 sm:px-6 lg:px-8">
				<div className="max-w-3xl mx-auto">
					<LoadingSpinner />
				</div>
			</div>
		);
	if (!product)
		return (
			<ErrorAlert
				open={true}
				setOpen={setNoProduct}
				errorTitle={`Listing not found`}
				errorMessage={`We couldn't find a listing with id: ${cid}. Return to the listings page to see what's available.`}
				href={"/listings"}
			/>
		);

	return (
		<>
			{product.isAuction ? (
				<AuctionListingCard cid={cid as string} product={product} />
			) : (
				<ListingCard cid={cid as string} product={product} />
			)}
		</>
	);
}
